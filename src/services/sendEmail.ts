import { Resend } from "resend";
import AppointmentCreated from "@/components/emails-templates/AppointmentCreated";
import {
  Patient,
  Tutor,
  Appointment,
} from "../../src/types/appoinmentsData.ts";
interface EmailData {
  patient: Patient;
  tutor: Tutor;
  appointment: Appointment;
}
const resend = new Resend(import.meta.env.RESEND_API_KEY);
const sendEmail = (emailData: EmailData, calendarLink: string) => {
  const promises = [
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rodrigod33d@gmail.com",
      subject: "¡Se agendó un turno exitosamente!",
      react: AppointmentCreated({ emailData }),
    }),
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rodrigod33d@gmail.com",
      subject: "Nuevo turno agendado",
      react: AppointmentCreated({ emailData, calendarLink }),
    }),
  ];

  //TODO: handle of errors
  return Promise.allSettled(promises).then((results) => results);
};
export default sendEmail;
