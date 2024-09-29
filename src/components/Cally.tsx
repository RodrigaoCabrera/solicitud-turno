import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { CalendarDate, CalendarMonth } from "./Calendar";
import {
  format,
  diffMinutes,
  isEqual,
  addMonth,
  monthEnd,
  isBefore,
} from "@formkit/tempo";
import TimeSlotSelector from "./TimeSlotSelector.tsx";
import AppointmentModality from "./AppointmentModality.tsx";
import { Modal, ModalTrigger } from "./UI/modal/Modal.tsx";

/* Styles */
import "../styles/cally.css";
import { AppointmentInfo, AppointmentsType } from "@/types/appointments.ts";
import { AvailabilityType } from "@/types/availability.ts";
import { ProfessionalData } from "@/types/professionalData.ts";

type GroupedAppointments = {
  [key: string]: AppointmentsType[];
};
function Picker({
  value,
  onChange,
  availability,
  appointments,
  today,
}: {
  value: AppointmentInfo;
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
  professionalData: ProfessionalData;
  availability: AvailabilityType[];
  appointments: AppointmentsType[];
  today: Date;
}) {
  const availableDays = availability.map(
    (data: AvailabilityType) => data.dayOfWeek
  );

  const groupedAppointments = useMemo(() => {
    return Object.groupBy(appointments, (appointment) => {
      const day = format({ date: appointment.date, format: "YYYY-MM-DD" });
      return day;
    });
  }, [appointments])
  
  const isfilledSchedule = (date: Date) => {
    // Filtrar los appointments que coincidan con el 'date'
    const currentDay: string = format({ date: date, format: "YYYY-MM-DD" });

    const selectedDayAppointments = groupedAppointments[currentDay];

    if (!selectedDayAppointments) {
      return false;
    }

    for (let i = 0; i <= availability.length; i++) {
      const availabilityObj = availability[i];
      if (availabilityObj.dayOfWeek === date.getUTCDay()) {
        // Determinar si la cantidad de sesiones es igual a la cantidad de appointment
        const selectedDayAppointmentsAmount = selectedDayAppointments.length;
        return availabilityObj.sessionAmount === selectedDayAppointmentsAmount;
      }
    }

    return false;
  };

  const isDateDisallowed = (date: Date) => {
    const isBeforeToDay = isBefore(date, today);
    if (isBeforeToDay) {
      return true;
    }
    if (availableDays.length <= 0) {
      return true;
    }

    if (!availableDays.includes(date.getUTCDay())) {
      return true;
    }

    return isfilledSchedule(date);
  };

  return (
    <div>
      <p className="text-sm text-[#222B45] mb-1">Fecha</p>
      <CalendarDate
        value={value.calendarDate}
        min={format(today, "YYYY-MM-DD")} // Dí a actual
        max={format(monthEnd(addMonth(today, 1)), "YYYY-MM-DD")} // ültimo día del siguiente mes
        isDateDisallowed={isDateDisallowed}
        onChange={onChange}
      >
        <span slot="previous">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="#3E3D3D"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 6L9 12L15 18"
              stroke="#535353"
              stroke-opacity="0.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 6L9 12L15 18"
              stroke="#535353"
              stroke-opacity="0.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <span slot="next">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="#3E3D3D"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 18L15 12L9 6"
              stroke="#535353"
              stroke-opacity="0.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 18L15 12L9 6"
              stroke="#535353"
              stroke-opacity="0.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

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
  availability: AvailabilityType[];
  appointments: AppointmentsType[];
}) {
  const [today, setToday] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return now;
  });

  const [value, setValue] = useState<AppointmentInfo>(() => {
    const storedDate = localStorage.getItem("storedDate");
    const storedTime = localStorage.getItem("storedTime");
    const modality = localStorage.getItem("modality");

    if (storedDate && storedTime && modality) {
      const isBeforeTheSelectedDate = isBefore(storedDate, today);
      console.log({ isBeforeTheSelectedDate });
      return {
        calendarDate: isBeforeTheSelectedDate ? "" : storedDate,
        calendarTime: storedTime,
        modality,
      };
    }

    return {
      calendarDate: "",
      calendarTime: "",
      modality: "",
    };
  });

  const [isSelectedDate, setIsSelectedDate] = useState<boolean>(
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

  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleModal = (action: "open" | "close") => {
    const $dialog = dialogRef.current;
    const isOpenDialog = $dialog?.open;
    if (isOpenDialog) {
      $dialog.close();
    } else {
      $dialog?.showModal();
    }
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
        today={today}
      />

      {professionalData && value.calendarDate && (
        <TimeSlotSelector
          value={value}
          availability={availability}
          sessionTime={professionalData?.sessionTime}
          appointments={appointments}
          onChange={onChange}
        />
      )}

      <Modal
        dialogRef={dialogRef}
        handleModal={handleModal}
        value={value}
        professionalData={professionalData}
      />
      <ModalTrigger
        action="open"
        handleModal={handleModal}
        isSelectedDate={isSelectedDate}
      >
        <span>Confirmar</span>
      </ModalTrigger>
    </>
  );
}

export default Cally;
