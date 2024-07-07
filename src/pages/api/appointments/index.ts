import { createHash } from "node:crypto";
import {
  object,
  string,
  boolean,
  email,
  number,
  safeParse,
  pipe,
  nonEmpty,
  toMinValue,
  maxLength,
  minLength,
  hash,
  picklist,
  date as dateType,
} from "valibot";
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
import { date, format } from "@formkit/tempo";

// Email type
const Email = pipe(
  string("The email must be a valid email address"),
  nonEmpty("Please enter your email."),
  email("The email is badly formatted.")
);

// DNI type
const DNI = pipe(
  string(),
  minLength(8, "The DNI must be at least 8 characters."),
  maxLength(8, "The DNI must not exceed 8 characters.")
);

// Patient type
const PatientType = picklist(
  ["Paciente regular", "Paciente nuevo"],
  "The patient type mst be one of the following options: Paciente regular or Paciente nuevo"
);

// phone type
const Phone = pipe(
  string(),
  minLength(10, "El número debe tener al menos 10 dígitos"),
  maxLength(13, "The DNI must not exceed 8 characters.")
);

// Hash ID
const HashId = pipe(
  string(),
  hash(["sha256"], "The specified professionalId is invalid.")
);

// Date type
const DateType = pipe(
  dateType("The date must be a valid ISO 8601 date string"),
  toMinValue(new Date())
);

// Request schema
const appoinmentDataSchema = object({
  patient: object({
    firstName: string(),
    lastName: string(),
    dni: DNI,
    age: number(),
    gender: string(),
    type: PatientType,
    healthInsurance: string(),
  }),

  tutor: object({
    firstName: string(),
    lastName: string(),
    dni: DNI,
    email: Email,
    phone: Phone,
    relationshipWithThePatient: string(),
  }),

  appointment: object({
    date: DateType,
    professionalId: HashId,
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
  const appointmentRequest = await request.json();

  // Convert appointment date a Date object
  appointmentRequest.appointment.date = new Date(
    appointmentRequest.appointment.date
  );

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
