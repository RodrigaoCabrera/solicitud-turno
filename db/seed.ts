import {
  db,
  Tutors,
  Patients,
  Appointments,
  ProfessionalProfile,
  Availability,
} from "astro:db";

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
  await db.insert(ProfessionalProfile).values([
    {
      id: "2345235",
      firstName: "Profesional name test",
      lastName: "Profesional lastname test",
      email: "profesional@test.com",
      profession: "Pediatra",
      sessionTime: 30,
      tuition: "1234",
    },
  ]);
  await db.insert(Availability).values([
    {
      id: 1,
      dayOfWeek: 1, // 0-6 para representar días de la semana
      startTimeAM: "09:00", // Formato HH:MM
      endTimeAM: "09:30", // Formato HH:MM
      startTimePM: "15:00", // Formato HH:MM
      endTimePM: "15:30", // Formato HH:MM

      professionalId: "2345235",
    },
    {
      id: 2,
      dayOfWeek: 2, // 0-6 para representar días de la semana
      startTimeAM: "09:00", // Formato HH:MM
      endTimeAM: "11:00", // Formato HH:MM
      startTimePM: "15:00", // Formato HH:MM
      endTimePM: "15:30", // Formato HH:MM

      professionalId: "2345235",
    },
  ]);
}
