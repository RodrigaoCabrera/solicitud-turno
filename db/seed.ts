import { db, Tutors, Patients, Appointments } from "astro:db";

export default async function () {
  await db.insert(Tutors).values([
    {
      id: "1",
      first_name: "test",
      last_name: "test",
      email: "mail@test.com",
      phone: 235235345,
    },
    {
      id: "2",
      first_name: "tutor 2",
      last_name: "test tutor 2",
      email: "tutor2@test.com",
      phone: 235235345,
    },
  ]);

  await db.insert(Patients).values([
    {
      id: "1",
      first_name: "Jane",
      last_name: "Doe",
      dni: "12345678",
      is_new_patient: true,
      health_insurance: "Some Insurance",
      tutor_id: "1",
    },
    {
      id: "2",
      first_name: "Jane 2",
      last_name: "Doe 2",
      dni: "123456782",
      is_new_patient: false,
      health_insurance: "Some Insurance",
      tutor_id: "2",
    },
    {
      id: "3",
      first_name: "Patient test",
      last_name: "patient 3",
      dni: "123456782",
      is_new_patient: false,
      health_insurance: "Some Insurance",
      tutor_id: "2",
    },
  ]);

  await db.insert(Appointments).values([
    {
      id: "1",
      appointment_date: "2024-06-22",
      appointment_time: "09:30",
      patient_id: "3",
    },
    {
      id: "2",
      appointment_date: "2024-06-23",
      appointment_time: "10:30",
      patient_id: "2",
    },
    {
      id: "3",
      appointment_date: "2024-06-24",
      appointment_time: "09:30",
      patient_id: "1",
    },
  ]);
}
