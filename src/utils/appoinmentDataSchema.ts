import {
  object,
  string,
  email,
  number,
  pipe,
  nonEmpty,
  maxLength,
  minLength,
  hash,
  picklist,
  isoDate,
  isoTime,
  trim,
} from "valibot";

// Email type
const Email = pipe(
  string(),
  nonEmpty("Por favor ingresa un email"),
  email("El email tiene un formato incorrecto")
);

// DNI type
const DNI = pipe(
  string(),
  minLength(8, "El DNI debe tener al menos 8 carácteres"),
  maxLength(8, "EL DNI no debe tener más 8 carácteres"),
  trim()
);

// Patient type
const PatientType = picklist(
  ["Paciente regular", "Paciente nuevo"],
  "El tipo de paciente debe ser una de las siguientes opciones: Paciente regular or Paciente nuevo"
);

// phone type
const Phone = pipe(
  string(),
  minLength(10, "El número debe tener al menos 10 dígitos"),
  maxLength(13, "El número deber ser como máximo de 13 dígitos"),
  trim()
);

// Hash ID
const HashId = pipe(
  string(),
  hash(["sha256"], "The specified professionalId is invalid.")
);

// Date type
const IsoDate = pipe(string(), isoDate("The date is badly formatted."), trim());
const IsoTime = pipe(string(), isoTime("The time is badly formatted."), trim());

// Appointment modality
const AppointmentModality = picklist(
  ["face-to-face", "online"],
  "modality must be one of the following options: face-to-face, or online"
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
    date: IsoDate,
    time: IsoTime,
    professionalId: HashId,
    modality: AppointmentModality,
  }),
});
