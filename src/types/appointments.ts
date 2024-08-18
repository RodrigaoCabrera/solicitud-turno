export interface AppointmentsType {
  id: string;
  date: string;
  time: string;
  isActive: boolean;
  professionalId: string;
  patientId: string;
}
export interface EmailData {
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
export interface AppointmentInfo {
  calendarDate: string;
  calendarTime: string;
  modality: string;
}
