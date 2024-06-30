import { useState, type ChangeEvent } from "react";
import { CalendarDate, CalendarMonth } from "./Calendar";
import {
  format,
  diffMinutes,
  isEqual,
  addMonth,
  monthEnd,
} from "@formkit/tempo";
import CalendarTime from "./CalendarTime.tsx";

interface Appointmentdate {
  calendarDate: string;
  calendarTime: string;
}
interface Availability {
  id: string;
  dayOfWeek: number; // 0-6 para representar días de la semana
  startTimeAM: string; // Formato HH:MM
  endTimeAM: string; // Formato HH:MM
  startTimePM: string; // Formato HH:MM
  endTimePM: string; // Formato HH:MM
  professionalId: string;
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
  Availability: Availability;
  ProfessionalProfile: ProfessionalProfile;
}

function Picker({
  value,
  onChange,
  professionalData,
  appointments,
}: {
  value: Appointmentdate;
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
  professionalData: ProfessionalData[];
  appointments: Appointments[];
}) {
  const [today, setToday] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return now;
  });

  const availableDays = professionalData.map(
    (data) => data.Availability.dayOfWeek
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

    // Cálculo de la cantidad de sesiones disponibles por día según el sesionTime y el rango horario tanto AM como PM
    const session = professionalData.filter(
      (data) => data.Availability.dayOfWeek === date.getDay()
    );
    const availability: Availability = session[0].Availability;
    let sessionsAmount = 0;
    const sessionStartAM = availability.startTimeAM; //"09:00";
    const sessionEndAM = availability.endTimeAM; // "11:00";
    sessionsAmount =
      diffMinutes(
        new Date(`${format(date, "YYYY-MM-DD")} ${sessionEndAM}`),
        `${format(date, "YYYY-MM-DD")} ${sessionStartAM}`
      ) / professionalData[0].ProfessionalProfile.sessionTime;

    const sessionStartPM = availability.startTimePM;
    const sessionEndPM = availability.endTimePM;
    sessionsAmount +=
      diffMinutes(
        new Date(`${format(date, "YYYY-MM-DD")} ${sessionEndPM}`),
        `${format(date, "YYYY-MM-DD")} ${sessionStartPM}`
      ) / professionalData[0].ProfessionalProfile.sessionTime;

    // Determinar si la cantidad de sesiones es igual a la cantidad de appointment
    const appointmentsAmount = filteredAppointments.length;
    return sessionsAmount === appointmentsAmount;
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
  appointments,
}: {
  professionalData: ProfessionalData[];
  appointments: Appointments[];
}) {
  const [value, setValue] = useState((): Appointmentdate => {
    const storedDate = localStorage.getItem("storedDate");

    if (storedDate) {
      return {
        calendarDate: format(storedDate, "YYYY-MM-DD"),
        calendarTime: format(storedDate, "HH:mm"),
      };
    }

    return {
      calendarDate: "",
      calendarTime: "",
    };
  });

  const onChange = (event: Event | ChangeEvent<HTMLInputElement>) => {
    const e = event.target as HTMLInputElement;

    const newCalendardate = {
      ...value,
      [e.id]: e.value,
    };

    setValue(newCalendardate);
  };

  const goToAppointmentForm = () => {
    const t = new Date(`${value.calendarDate} ${value.calendarTime}`);

    const newDate = format(t, "YYYY-MM-DDTHH:mm:ssZ");
    localStorage.setItem("storedDate", newDate);
  };

  return (
    <>
      <p>Value is: {value.calendarDate}</p>
      <Picker
        value={value}
        onChange={onChange}
        professionalData={professionalData}
        appointments={appointments}
      />

      <CalendarTime onChange={onChange} timeValue={value.calendarTime} />
      <a type="button" href="/appointments" onClick={goToAppointmentForm}>
        Confirmar
      </a>
    </>
  );
}

export default Cally;
