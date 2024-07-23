import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import {
  db,
  eq,
  Tutors,
  Patients,
  Appointments,
  Availability,
  ProfessionalProfile,
} from "astro:db";
import { date, parse } from "@formkit/tempo";
import { safeParse } from "valibot";

import { appoinmentDataSchema } from "@/utils/appoinmentDataSchema";

const generateId = (str: string) => {
  return createHash("sha256").update(str).digest("hex");
};
// Response
const res = (
  body: { message: string; id?: string },
  {
    status,
    statusText,
    headers,
  }: { status?: number; statusText?: string; headers?: Headers }
) => new Response(JSON.stringify(body), { status, statusText, headers });

export const POST: APIRoute = async ({ request }) => {
  const appointmentRequest = await request.json();

  // Convert appointment date a Date object
  /*  appointmentRequest.appointment.date = new Date(
    appointmentRequest.appointment.date
  );
 */
  // Validate appointment data
  const { success, output, issues } = safeParse(
    appoinmentDataSchema,
    appointmentRequest
  );

  if (!success)
    return res(
      { message: `Bad request: ${issues[0].message}` },
      { status: 400 }
    );

  // Verify if there's availability for that day
  const availableDays = await db
    .select({ dayOfWeek: Availability.dayOfWeek })
    .from(Availability);

  const data = output;
  const { patient, tutor, appointment } = data; // Datos de la request

  // Verify if there's a  professional profile with professionalId of the request
  const professionalProfile = await db
    .select({ id: ProfessionalProfile.id })
    .from(ProfessionalProfile)
    .where(eq(ProfessionalProfile.id, output.appointment.professionalId));

  if (professionalProfile.length <= 0) {
    return res(
      {
        message: `No existe ningún perfil profesional con el professionalId: ${output.appointment.professionalId}`,
      },
      { status: 400 }
    );
  }

  const isAvailableDay = availableDays.some((day) => {
    return day.dayOfWeek === date(appointment.date).getDay();
  });

  if (!isAvailableDay) {
    return res(
      { message: "No existe disponibilidad para la fecha solicitada" },
      { status: 409 }
    );
  }

  const appointmentId = generateId(JSON.stringify(appointment.date));
  const patientId = generateId(patient.dni);
  const tutorId = generateId(tutor.dni);

  // Check that patient does not has a appointment
  const existingAppointment = await db
    .select()
    .from(Appointments)
    .where(eq(Appointments.patientId, patientId))
    .limit(1);

  if (existingAppointment.length > 0 && existingAppointment[0].isActive) {
    return res(
      { message: "El paciente ya tiene un turno activo" },
      { status: 409 }
    ); // 409 Conflict
  }
  // Check if exist a active date
  const existingAppointmentDate = await db
    .select()
    .from(Appointments)
    .where(eq(Appointments.id, appointmentId))
    .limit(1);

  if (
    existingAppointmentDate.length > 0 &&
    existingAppointmentDate[0].isActive
  ) {
    return res(
      {
        message: "Ya existe un turno para la fecha y hora especificadas",
      },
      {
        status: 409,
      }
    );
  }

  // Add tutor data
  await db
    .insert(Tutors)
    .values({
      id: tutorId,
      ...tutor,
    })
    .onConflictDoNothing();

  // Add patient data
  await db
    .insert(Patients)
    .values({
      id: patientId,
      ...patient,
      tutorId,
    })
    .onConflictDoUpdate({ target: Patients.id, set: { ...patient } });
  // Add tutor data
  await db
    .insert(Appointments)
    .values({
      id: appointmentId,
      ...appointment,
      isActive: true,
      patientId: patientId,
    })
    .onConflictDoUpdate({
      target: Appointments.id,
      set: { isActive: true, patientId: patientId },
    });

  return res(
    { message: "Turno reservado con éxito", id: appointmentId },
    { status: 200 }
  );
};
