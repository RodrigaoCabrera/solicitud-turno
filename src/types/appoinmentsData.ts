export interface Patient {
  firstName: string;
  lastName: string;
  dni: string;
  age: number;
  gender: string;
  type: string;
  healthInsurance: string;
}

export interface Tutor {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  relationshipWithThePatient: string;
}

export interface Appointment {
  date: string;
  time: string;
  professionalId: string;
  modality: string;
}
