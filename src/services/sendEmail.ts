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
const sendEmail = async (emailData: EmailData, calendarLink: string) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "rodrigod33d@gmail.com",
    subject: "¡Se agendó un turno exitosamente!",
    react: AppointmentCreated({ emailData, calendarLink }),
  });

  if (error) {
    throw new Error("Failed to send email");
  }

  return data;
};

export default sendEmail;
