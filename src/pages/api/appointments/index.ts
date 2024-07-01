import { createHash } from "node:crypto";
import { object, string, boolean, email, number, safeParse } from "valibot";
import type { APIRoute } from "astro";
import { db, eq, Tutors, Patients, Appointments } from "astro:db";

// Request schema
const appoinmentDataSchema = object({
  patient: object({
    firstName: string(),
    lastName: string(),
    dni: string(),
    isNewPatient: boolean(),
    healthInsurance: string(),
  }),

  tutor: object({
    firstName: string(),
    lastName: string(),
    email: string(),
    phone: number(),
  }),

  appointment: object({
    date: string(),
    professionalId: string(),
  }),
});

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
  const { success, output } = safeParse(
    appoinmentDataSchema,
    await request.json()
  );

  if (!success) return res({ message: "Bad request" }, { status: 400 });

  const data = output;
  const { patient, tutor, appointment } = data;

  const appointmentId = generateId(appointment.date);
  const patientId = generateId(patient.dni);
  const tutorId = generateId(tutor.email);

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
