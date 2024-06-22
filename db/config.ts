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

/** TODO: Cada vez que se envia una solicitud por un patients, se debe actualizar el turno o crear uno nuevo. La solicitud se debe distinguir con dos valores, new-appointments y update-appointments */

const Appointments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // TIene que se el id del patients
    appointmentDate: column.text(),
    appointmentTime: column.text(),

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
