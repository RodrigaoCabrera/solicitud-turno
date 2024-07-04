import { db, ProfessionalProfile, Availability } from "astro:db";

export default async function () {
  // Professional data
  await db.insert(ProfessionalProfile).values([
    {
      id: "22a3c85609d4d626bc01cd87df71d01f6bb9a62efce214d37b0d4faf4f3ebb74",
      firstName: "Carola",
      lastName: "Fagalde",
      email: "carola.fagalde@gmail.com",
      phone: "+541165687151",
      registrationNumber: "123456",
      profession: "Médica Pediatra",
      aboutMe:
        "Dr. Bellamy Nicholas is a top specialist at London Bridge Hospital at London. He has achieved several awards and recognition for is contribution and service in his own field. He is available for private consultation.",
      address: "Irastorza 910 (3460) Curuzú Cuatiá, Corrientes  ",
      sessionTime: 15,
    },
  ]);

  // Professional availability data
  await db.insert(Availability).values([
    {
      id: 0,
      dayOfWeek: 0,
      startTimeAM: "09:00",
      endTimeAM: "09:30",
      startTimePM: "15:00",
      endTimePM: "15:30",
      sessionAmount: 2,
      professionalId:
        "22a3c85609d4d626bc01cd87df71d01f6bb9a62efce214d37b0d4faf4f3ebb74",
    },
    {
      id: 1,
      dayOfWeek: 1,
      startTimeAM: "09:00",
      endTimeAM: "09:30",
      startTimePM: "15:00",
      endTimePM: "16:00",
      sessionAmount: 2,
      professionalId:
        "22a3c85609d4d626bc01cd87df71d01f6bb9a62efce214d37b0d4faf4f3ebb74",
    },
    {
      id: 2,
      dayOfWeek: 2,
      startTimeAM: "09:00",
      endTimeAM: "11:00",
      startTimePM: "15:00",
      endTimePM: "16:00",
      sessionAmount: 2,
      professionalId:
        "22a3c85609d4d626bc01cd87df71d01f6bb9a62efce214d37b0d4faf4f3ebb74",
    },
  ]);
}
