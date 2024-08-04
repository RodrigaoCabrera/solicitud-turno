export interface AvailabilityType {
  id: number;
  dayOfWeek: number; // 0-6 para representar días de la semana
  startTimeAM: string; // Formato HH:MM
  endTimeAM: string; // Formato HH:MM
  startTimePM: string; // Formato HH:MM
  endTimePM: string; // Formato HH:MM
  professionalId: string;
  sessionAmount: number;
}
