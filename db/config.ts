import { column, defineDb, defineTable } from "astro:db";

const Tutors = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    firstName: column.text(),
    lastName: column.text(),
    dni: column.text({ unique: true }),
    email: column.text({ unique: true }),
    phone: column.text(),
    relationshipWithThePatient: column.text(),
  },
});
const Patients = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    firstName: column.text(),
    lastName: column.text(),
    dni: column.text(),
    age: column.number(),
    gender: column.text(),
    type: column.text(),
    healthInsurance: column.text(),

    tutorId: column.text({ references: () => Tutors.columns.id }),
  },
});

const Appointments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    date: column.date(),
    isActive: column.boolean(),

    patientId: column.text({ references: () => Patients.columns.id }),

    professionalId: column.text({
      references: () => ProfessionalProfile.columns.id,
    }),
  },
});

const ProfessionalProfile = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    firstName: column.text(),
    lastName: column.text(),
    email: column.text({ unique: true }),
    phone: column.text({ unique: true }),
    profession: column.text(),
    aboutMe: column.text(),
    address: column.text(),
    sessionTime: column.number(),
    registrationNumber: column.text({ unique: true }),
  },
});

const Availability = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    dayOfWeek: column.number({ unique: true }), // 0-6 para representar días de la semana
    startTimeAM: column.text(), // Formato HH:MM
    endTimeAM: column.text(), // Formato HH:MM
    startTimePM: column.text(), // Formato HH:MM
    endTimePM: column.text(), // Formato HH:MM
    sessionAmount: column.number(),

    professionalId: column.text({
      references: () => ProfessionalProfile.columns.id,
    }),
  },
});

export default defineDb({
  tables: {
    Tutors,
    Patients,
    Appointments,
    ProfessionalProfile,
    Availability,
  },
});
