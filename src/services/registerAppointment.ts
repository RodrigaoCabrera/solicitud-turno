import { Patient, Tutor, Appointment } from "../types/appoinmentsData.ts";
interface AppointmentData {
  patient: Patient;
  tutor: Tutor;
  appointment: Appointment;
}
interface AppointmentResponse {
  id: string | number;
  message: string;
}
const registerAppointment = async (
  appointmentData: AppointmentData,
  url: string
): Promise<AppointmentResponse | { error: string }> => {
  const response = await fetch(`${url}/api/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.message || "Failed to register appointment" };
  }

  return await response.json();
};

export default registerAppointment;
