import { db, Tutors, Patients, Appointments } from "astro:db";

export default async function () {
  await db.insert(Tutors).values([
    {
      id: "1",
      firstName: "test",
      lastName: "test",
      email: "mail@test.com",
      phone: 235235345,
    },
    {
      id: "2",
      firstName: "tutor 2",
      lastName: "test tutor 2",
      email: "tutor2@test.com",
      phone: 235235345,
    },
  ]);

  await db.insert(Patients).values([
    {
      id: "1",
      firstName: "Jane",
      lastName: "Doe",
      dni: "12345678",
      isNewPatient: true,
      healthInsurance: "Some Insurance",
      tutorId: "1",
    },
    {
      id: "2",
      firstName: "Jane 2",
      lastName: "Doe 2",
      dni: "123456782",
      isNewPatient: false,
      healthInsurance: "Some Insurance",
      tutorId: "2",
    },
    {
      id: "3",
      firstName: "Patient test",
      lastName: "patient 3",
      dni: "123456782",
      isNewPatient: false,
      healthInsurance: "Some Insurance",
      tutorId: "2",
    },
    {
      id: "4",
      firstName: "Patient API",
      lastName: "last name API",
      dni: "123456782",
      isNewPatient: false,
      healthInsurance: "Some Insurance",
      tutorId: "1",
    },
  ]);

  await db.insert(Appointments).values([
    {
      id: "1",
      appointmentDate: "2024-06-22",
      appointmentTime: "09:30",
      patientId: "3",
    },
    {
      id: "2",
      appointmentDate: "2024-06-23",
      appointmentTime: "10:30",
      patientId: "2",
    },
    {
      id: "3",
      appointmentDate: "2024-06-24",
      appointmentTime: "09:30",
      patientId: "1",
    },
  ]);
}
