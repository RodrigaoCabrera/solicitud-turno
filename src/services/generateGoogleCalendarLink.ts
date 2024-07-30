import { Appointment } from "@/types/appoinmentsData";
import { ProfessionalData } from "@/types/professionalData";

function isGoogleCalendarUrl(url: string): url is string {
  return url.startsWith(
    "https://www.google.com/calendar/render?action=TEMPLATE"
  );
}

interface Props {
  appointment: Appointment;
  professionalData: ProfessionalData;
  guest?: string;
}

const generateGoogleCalendarLink = ({
  appointment,
  professionalData,
  guest,
}: Props) => {
  const { date, time, modality } = appointment;
  const startDate = new Date(`${date}T${time}`);
  const endDate = new Date(
    startDate.getTime() + professionalData.sessionTime * 60 * 1000
  ); // Asume 30 min de duración

  const event = {
    text: `Turno médico con: ${professionalData.firstName} ${professionalData.lastName}`,
    dates: `${startDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${endDate
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")}`,
    details: "Description",
    location:
      modality === "face-to-face"
        ? `Dirección: ${professionalData.address}`
        : "Vía google meet",
    guest,
  };

  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.text
  )}&dates=${event.dates}&details=${encodeURIComponent(
    event.details
  )}&location=${encodeURIComponent(event.location)}&add=${encodeURIComponent(
    event.guest ? event.guest : ""
  )}`;

  if (!isGoogleCalendarUrl(calendarUrl)) {
    throw new Error("Failed to generate a valid Google Calendar URL");
  }

  return calendarUrl;
};
export default generateGoogleCalendarLink;
