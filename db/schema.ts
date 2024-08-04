import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const Tutors = pgTable("tutors", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dni: text("dni").unique(),
  email: text("email"),
  phone: text("phone"),
  relationshipWithThePatient: text("relationship_with_the_patient"),
});

export const Patients = pgTable("patients", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dni: text("dni"),
  age: integer("age"),
  gender: text("gender"),
  type: text("type"),
  healthInsurance: text("health_insurance"),
  tutorId: text("tutor_id").references(() => Tutors.id),
});

export const Appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  date: text("date"),
  time: text("time"),
  isActive: boolean("is_active"),
  modality: text("modality"),
  patientId: text("patient_id").references(() => Patients.id),
  professionalId: text("professional_id").references(
    () => ProfessionalProfile.id
  ),
});

export const ProfessionalProfile = pgTable("professional_profile", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique(),
  phone: text("phone").unique(),
  profession: text("profession"),
  aboutMe: text("about_me"),
  address: text("address"),
  sessionTime: integer("session_time"),
  registrationNumber: text("registration_number").unique(),
});

export const Availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").unique(), // 0-6 para representar días de la semana
  startTimeAM: text("start_time_am"), // Formato HH:MM
  endTimeAM: text("end_time_am"), // Formato HH:MM
  startTimePM: text("start_time_pm"), // Formato HH:MM
  endTimePM: text("end_time_pm"), // Formato HH:MM
  sessionAmount: integer("session_amount"),
  professionalId: text("professional_id").references(
    () => ProfessionalProfile.id
  ),
});
