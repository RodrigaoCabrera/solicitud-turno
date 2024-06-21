import { column, defineDb, defineTable } from "astro:db";

const Tutors = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    first_name: column.text(),
    last_name: column.text(),
    email: column.text(),
    phone: column.number(),
  },
});
const Patients = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    first_name: column.text(),
    last_name: column.text(),
    dni: column.text(),
    is_new_patient: column.boolean(),
    health_insurance: column.text(),

    tutor_id: column.text({ references: () => Tutors.columns.id }),
  },
});
// Cada vez que se envia una solicitud por un patients, se debe actualizar el turno o crear uno nuevo. La solicitud se debe distinguir con dos valores, new-appointments y update-appointments

const Appointments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // TIene que se el id del patients
    appointment_date: column.text(),
    appointment_time: column.text(),

    patient_id: column.text({ references: () => Patients.columns.id }),
  },
});

export default defineDb({
  tables: {
    Tutors,
    Patients,
    Appointments,
  },
});
