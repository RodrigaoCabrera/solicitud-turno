import { useState, type ChangeEvent } from "react";
import { CalendarDate, CalendarMonth } from "./Calendar";
import {
  format,
  diffMinutes,
  isEqual,
  addMonth,
  monthEnd,
} from "@formkit/tempo";
import TimeSlotSelector from "./TimeSlotSelector.tsx";

interface Appointmentdate {
  calendarDate?: string;
  calendarTime?: string;
}
interface Availability {
  id: number;
  dayOfWeek: number; // 0-6 para representar días de la semana
  startTimeAM: string; // Formato HH:MM
  endTimeAM: string; // Formato HH:MM
  startTimePM: string; // Formato HH:MM
  endTimePM: string; // Formato HH:MM
  professionalId: string;
  sessionAmount: number;
}
interface ProfessionalProfile {
  id: string;
  firstName: string; // 0-6 para representar días de la semana
  lastName: string; // Formato HH:MM
  email: string; // Formato HH:MM
  profession: string; // Formato HH:MM
  sessionTime: number; // Formato HH:MM
}

interface Appointments {
  id: string;
  date: string;
  isActive: boolean;
  professionalId: string;
  patientId: string;
}
interface ProfessionalData {
  id: string;
  sessionTime: number;
}

function Picker({
  value,
  onChange,
  professionalData,
  availability,
  appointments,
}: {
  value: Appointmentdate;
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
  professionalData: ProfessionalData;
  availability: Availability[];
  appointments: Appointments[];
}) {
  const [today, setToday] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return now;
  });

  const availableDays = availability.map(
    (data: Availability) => data.dayOfWeek
  );

  const isfilledSchedule = (date: Date) => {
    // Filtrar los appointments que coincidan con el 'date'
    const filteredAppointments = appointments.filter(
      (appointment: Appointments) => {
        const calenddarDate = format({
          date,
          format: "YYYY-MM-DD",
          tz: "Pacific/Chatham",
        });
        const appointmentDate = format(appointment.date, "YYYY-MM-DD");
        return isEqual(calenddarDate, appointmentDate);
      }
    );

    if (filteredAppointments.length <= 0) {
      return false;
    }

    const session = availability.filter(
      (data: Availability) => data.dayOfWeek === date.getDay()
    );

    for (let i = 0; i <= availability.length; i++) {
      const availabilityObj = availability[i];
      if (availabilityObj.dayOfWeek === date.getDay()) {
        // Determinar si la cantidad de sesiones es igual a la cantidad de appointment
        const appointmentsAmount = filteredAppointments.length;
        return availabilityObj.sessionAmount === appointmentsAmount;
      }
    }
  };

  // Determinar cuantas sesiones tiene por dia segun la cantidad de minutos por sesion. Luego ver cuantos appointment tiene en ese dia de la semana, si ya hay existe la cantidad de sesiones diaria, ese día debe estar deshabilitado
  const isDateDisallowed = (date: Date) => {
    if (availableDays.length > 0 && availableDays.includes(date.getDay())) {
      if (isfilledSchedule(date)) return true;
      return false;
    }

    return true;
  };
  return (
    <div>
      <CalendarDate
        value={value.calendarDate}
        min={format(today, "YYYY-MM-DD")} // Dí a actual
        max={format(monthEnd(addMonth(today, 1)), "YYYY-MM-DD")} // ültimo día del siguiente mes
        locale="es-ES"
        isDateDisallowed={isDateDisallowed}
        onChange={onChange}
      >
        <CalendarMonth />
      </CalendarDate>
    </div>
  );
}

function Cally({
  professionalData,
  availability,
  appointments,
}: {
  professionalData: ProfessionalData;
  availability: Availability[];
  appointments: Appointments[];
}) {
  const [value, setValue] = useState(() => {
    const storedDate = localStorage.getItem("storedDate");

    if (storedDate) {
      return {
        calendarDate: format(storedDate, "YYYY-MM-DD"),
        calendarTime: format(storedDate, "HH:mm"),
      };
    }

    return {};
  });

  const [isSelectedDate, setIsSelectedDate] = useState(false);

  const onChange = (event: Event | ChangeEvent<HTMLInputElement>) => {
    const e = event.target as HTMLInputElement;

    const inputName = e.name || e.id;
    const newCalendarDate = {
      ...value,
      [inputName]: e.value,
    };

    setValue(newCalendarDate);

    // To active 'Confirmate' button when the user selects a date
    setIsSelectedDate(!!newCalendarDate.calendarTime);
  };

  const goToAppointmentForm = () => {
    const t = new Date(`${value.calendarDate} ${value.calendarTime}`);

    const newDate = format(t, "YYYY-MM-DDTHH:mm:ssZ");
    localStorage.setItem("storedDate", newDate);
    localStorage.setItem("professionalId", professionalData.id);
  };

  return (
    <>
      <p>Value is: {value.calendarDate}</p>
      <Picker
        value={value}
        onChange={onChange}
        professionalData={professionalData}
        availability={availability}
        appointments={appointments}
      />

      {professionalData && value.calendarDate && (
        <TimeSlotSelector
          //onChange={onChange}
          value={value}
          availability={availability}
          sessionTime={professionalData?.sessionTime}
          appointments={appointments}
          onChange={onChange}
        />
      )}
      <button
        onClick={goToAppointmentForm}
        type="button"
        disabled={!isSelectedDate}
      >
        <a href="/appointments">Confirmar</a>
      </button>
    </>
  );
}

export default Cally;
