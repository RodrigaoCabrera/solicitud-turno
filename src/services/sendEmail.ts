import { Resend } from "resend";
import AppointmentCreated from "@/components/emails-templates/AppointmentCreated";
import {
  Patient,
  Tutor,
  Appointment,
} from "../../src/types/appoinmentsData.ts";
interface EmailData {
  date: string;
  time: string;
  modality: string;
  patientName: string;
  patientLastName: string;
  healthInsurance: string;
  tutorName: string;
  tutorLastName: string;
  email: string;
  address: string;
}
const resend = new Resend(import.meta.env.RESEND_API_KEY);
const sendEmail = (appointmentData: EmailData, calendarLink: string) => {
  const promises = [
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: appointmentData.email,
      subject: "¡Se agendó un turno exitosamente!",
      react: AppointmentCreated({
        appointmentData,
        isEmailForProfessional: false,
      }),
    }),
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rodrigod33d@gmail.com",
      subject: "Nuevo turno agendado",
      react: AppointmentCreated({
        appointmentData,
        calendarLink,
        isEmailForProfessional: true,
      }),
    }),
  ];

  //TODO: handle of errors
  return Promise.allSettled(promises).then((results) => results);
};
export default sendEmail;
