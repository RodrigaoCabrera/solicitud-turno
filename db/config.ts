import { column, defineDb, defineTable } from "astro:db";

const Tutors = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    firstName: column.text(),
    lastName: column.text(),
    email: column.text({ unique: true }),
    phone: column.number(),
  },
});
const Patients = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    firstName: column.text(),
    lastName: column.text(),
    dni: column.text(),
    isNewPatient: column.boolean(),
    healthInsurance: column.text(),

    tutorId: column.text({ references: () => Tutors.columns.id }),
  },
});

const Appointments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    date: column.text(),
    isActive: column.boolean(),

    patientId: column.text({ references: () => Patients.columns.id }),
  },
});

export default defineDb({
  tables: {
    Tutors,
    Patients,
    Appointments,
  },
});
