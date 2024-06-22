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
    appointmentDate: string(),
    appointmentTime: string(),
  }),
});

const generateId = (str: string) => {
  return createHash("sha256").update(str).digest("hex");
};
// Response
const res = (
  body: string,
  {
    status,
    statusText,
    headers,
  }: { status?: number; statusText?: string; headers?: Headers }
) => new Response(body, { status, statusText, headers });

export const POST: APIRoute = async ({ request }) => {
  const { success, output } = safeParse(
    appoinmentDataSchema,
    await request.json()
  );

  if (!success) return res("Bad request", { status: 400 });

  const data = output;
  const { patient, tutor, appointment } = data;

  const appointmentId = generateId(patient.dni);
  const tutorId = generateId(tutor.email);

  // Check that patient does not exist
  const existingAppointment = await db
    .select()
    .from(Appointments)
    .where(eq(Appointments.patientId, appointmentId))
    .limit(1);

  if (existingAppointment.length > 0) {
    return res("El paciente ya tiene un turno activo", { status: 409 }); // 409 Conflict
  }

  // Check if there is a appointmentTime
  const existingDateTimeAppointment = await db
    .select()
    .from(Appointments)
    .where(eq(Appointments.appointmentTime, appointment.appointmentTime))
    .limit(1);

  if (existingDateTimeAppointment.length > 0) {
    return res(
      JSON.stringify({
        message: "Ya existe un turno para la fecha y hora especificadas",
      }),
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
  await db.insert(Patients).values({
    id: appointmentId,
    ...patient,
    tutorId,
  });

  // Add tutor data
  await db.insert(Appointments).values({
    id: appointmentId,
    ...appointment,
    patientId: appointmentId,
  });

  return res("Turno reservado con éxito", { status: 200 });
};
