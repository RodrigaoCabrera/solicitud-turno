import { MouseEvent, useState, type ChangeEvent } from "react";
import { CalendarDate, CalendarMonth } from "./Calendar";
import {
  format,
  diffMinutes,
  isEqual,
  addMonth,
  monthEnd,
} from "@formkit/tempo";
import TimeSlotSelector from "./TimeSlotSelector.tsx";
import AppointmentModality from "./AppointmentModality.tsx";
import { Modal, ModalTrigger } from "./UI/modal/Modal.tsx";

interface Appointmentdate {
  calendarDate: string;
  calendarTime: string;
  modality: string;
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
  date: Date;
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
        const calendarDate = format({
          date,
          format: "YYYY-MM-DD",
          tz: "Pacific/Chatham",
        });
        const appointmentDate = format(appointment.date, "YYYY-MM-DD");
        return isEqual(calendarDate, appointmentDate);
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

    return false;
  };

  // Determinar cuantas sesiones tiene por dia segun la cantidad de minutos por sesion. Luego ver cuantos appointment tiene en ese dia de la semana, si ya hay existe la cantidad de sesiones diaria, ese día debe estar deshabilitado
  const isDateDisallowed = (date: Date) => {
    if (availableDays.length <= 0) {
      return true;
    }

    if (!availableDays.includes(date.getDay())) {
      return true;
    }

    return isfilledSchedule(date);
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
  const [value, setValue] = useState<Appointmentdate>(() => {
    const storedDate = localStorage.getItem("storedDate");
    const modality = localStorage.getItem("modality");

    if (storedDate && modality) {
      return {
        calendarDate: format(storedDate, "YYYY-MM-DD"),
        calendarTime: format(storedDate, "HH:mm"),
        modality: JSON.parse(modality),
      };
    }

    return {
      calendarDate: "",
      calendarTime: "",
      modality: "",
    };
  });

  const [isSelectedDate, setIsSelectedDate] = useState<Boolean>(
    () => !!value.calendarTime && !!value.modality
  );

  const onChange = (event: Event | ChangeEvent<HTMLInputElement>) => {
    const e = event.target as HTMLInputElement;

    const inputName = e.name || e.id;
    const newCalendarDate = {
      ...value,
      [inputName]: e.value,
    };

    setValue(newCalendarDate);

    // To active 'Confirmate' button when the user selects a date
    setIsSelectedDate(
      !!newCalendarDate.calendarTime && !!newCalendarDate.modality
    );
  };

  const goToAppointmentForm = () => {
    const t = new Date(`${value.calendarDate} ${value.calendarTime}`);

    const newDate = format(t, "YYYY-MM-DDTHH:mm:ssZ");
    localStorage.setItem("storedDate", newDate);
    localStorage.setItem("modality", JSON.stringify(value.modality));
    localStorage.setItem("professionalId", professionalData.id);
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleModal = (action: "open" | "close") => {
    console.log(action);
    setIsOpenModal(action === "open");
  };

  return (
    <>
      <AppointmentModality onChange={onChange} modality={value.modality} />
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

      <Modal isOpenModal={isOpenModal} handleModal={handleModal} />
      <ModalTrigger action="open" handleModal={handleModal}>
        <span>Confirmar</span>
      </ModalTrigger>
    </>
  );
}

export default Cally;
