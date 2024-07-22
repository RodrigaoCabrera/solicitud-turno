import {
  object,
  string,
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

// Appointment modality
const AppointmentModality = picklist(
  ["face-to-face", "online"],
  "modality mst be one of the following options: face-to-face, or online"
);

// Request schema
export const appoinmentDataSchema = object({
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
    modality: AppointmentModality,
  }),
});
