import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import {
  Tutors,
  Patients,
  Appointments,
  Availability,
  ProfessionalProfile,
} from "../../../../db/schema.ts";
import { db } from "../../../../db/db.ts";
import { eq, and } from "drizzle-orm";
import { date } from "@formkit/tempo";
import { safeParse } from "valibot";
import { appoinmentDataSchema } from "@/utils/appoinmentDataSchema";

const MAXIMUM_APPOINTMENT_ALLOWED = 1;

const generateId = (str: string) => createHash("sha256").update(str).digest("hex");

const createResponse = (body: { message: string; id?: string }, status: number) => 
  new Response(JSON.stringify(body), { status });

// Define a custom error type
class AppointmentError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'AppointmentError';
    this.status = status;
  }
}

const checkProfessionalProfile = async (professionalId: string) => {
  const profile = await db
    .select({ id: ProfessionalProfile.id })
    .from(ProfessionalProfile)
    .where(eq(ProfessionalProfile.id, professionalId))
    .limit(1);
  
  if (profile.length === 0) {
    throw new AppointmentError(`No existe ningún perfil profesional con el professionalId: ${professionalId}`);
  }
};

const checkAvailability = async (appointmentDate: string) => {
  const availableDays = await db
    .select({ dayOfWeek: Availability.dayOfWeek })
    .from(Availability);

  const isAvailableDay = availableDays.some(day => 
    day.dayOfWeek === date(appointmentDate).getDay()
  );

  if (!isAvailableDay) {
    throw new AppointmentError("No existe disponibilidad para la fecha solicitada");
  }
};

const checkExistingAppointment = async (appointmentId: string) => {
  const existingAppointment = await db
    .select()
    .from(Appointments)
    .where(and(eq(Appointments.id, appointmentId), eq(Appointments.isActive, true)))
    .limit(1);

  if (existingAppointment.length > 0) {
    throw new AppointmentError("Ya existe un turno para la fecha y hora especificadas", 409);
  }
};

const checkMaximumAppointments = async (patientId: string) => {
  const activeAppointments = await db
    .select()
    .from(Appointments)
    .where(and(eq(Appointments.patientId, patientId), eq(Appointments.isActive, true)));

  if (activeAppointments.length >= MAXIMUM_APPOINTMENT_ALLOWED) {
    throw new AppointmentError(`Solo tiene permitido agendar ${MAXIMUM_APPOINTMENT_ALLOWED} turnos`, 409);
  }
};

const upsertTutor = async (tutorData: any, tutorId: string) => {
  await db
    .insert(Tutors)
    .values({ id: tutorId, ...tutorData })
    .onConflictDoUpdate({ target: Tutors.id, set: tutorData });
};

const upsertPatient = async (patientData: any, patientId: string, tutorId: string) => {
  await db
    .insert(Patients)
    .values({ id: patientId, ...patientData, tutorId })
    .onConflictDoUpdate({ target: Patients.id, set: patientData });
};

const upsertAppointment = async (appointmentData: any, appointmentId: string, patientId: string) => {
  const inactiveAppointments = await db
    .select()
    .from(Appointments)
    .where(and(eq(Appointments.patientId, patientId), eq(Appointments.isActive, false)))
    .limit(1);

  if (inactiveAppointments.length > 0) {
    await db
      .update(Appointments)
      .set({ ...appointmentData, isActive: true })
      .where(eq(Appointments.id, inactiveAppointments[0].id));
  } else {
    await db
      .insert(Appointments)
      .values({
        id: appointmentId,
        ...appointmentData,
        isActive: true,
        patientId,
      })
      .onConflictDoUpdate({
        target: Appointments.id,
        set: { isActive: true, patientId },
      });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const appointmentRequest = await request.json();
    const { success, output, issues } = safeParse(appoinmentDataSchema, appointmentRequest);

    if (!success) {
      return createResponse({ message: `Bad request: ${issues[0].message}` }, 400);
    }

    const { patient, tutor, appointment } = output;

    await checkProfessionalProfile(appointment.professionalId);
    await checkAvailability(appointment.date);

    const appointmentId = generateId(appointment.date + appointment.time);
    const patientId = generateId(patient.dni);
    const tutorId = generateId(tutor.dni);

    await checkExistingAppointment(appointmentId);
    await checkMaximumAppointments(patientId);

    await upsertTutor(tutor, tutorId);
    await upsertPatient(patient, patientId, tutorId);
    await upsertAppointment(appointment, appointmentId, patientId);

    return createResponse({ message: "Turno reservado con éxito", id: appointmentId }, 200);
  } catch (error) {
    console.error("Error processing appointment:", error);
    if (error instanceof AppointmentError) {
      return createResponse({ message: error.message }, error.status);
    }
    return createResponse({ message: "Internal server error" }, 500);
  }
};