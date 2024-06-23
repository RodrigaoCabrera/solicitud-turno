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
  ]);

  await db.insert(Patients).values([
    {
      id: "40083227",
      firstName: "Jane",
      lastName: "Doe",
      dni: "40083227",
      isNewPatient: true,
      healthInsurance: "Some Insurance",
      tutorId: "1",
    },
  ]);

  await db.insert(Appointments).values([
    {
      id: "2024-01-01-10:30",
      date: "2024-01-01-10:30",
      isActive: false,
      patientId: "40083227",
    },
  ]);
}
