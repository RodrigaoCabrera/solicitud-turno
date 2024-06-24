import { useState, type ChangeEvent } from "react";
import { CalendarDate, CalendarMonth } from "./Calendar";
import { format, isEqual, parse, tzDate } from "@formkit/tempo";
import CalendarTime from "./CalendarTime.tsx";

interface Appointmentdate {
  calendarDate: string;
  calendarTime: string;
}

function Picker({
  value,
  onChange,
}: {
  value: Appointmentdate;
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
}) {
  const [today, setToday] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return format(now, "YYYY-MM-DD");
  });

  /** TODO: to parse date from backend */
  const unavailableDates = [
    "2024-06-25",
    "2024-06-26",
    "2024-06-28",
    "2024-07-01",
  ];

  // Unavailable date in ISO format
  const parsedUnavailableDates = unavailableDates.map((unavailableDate) => {
    const parsedDate = parse(unavailableDate);
    parsedDate.setUTCHours(0, 0, 0, 0);

    return parsedDate;
  });

  const isDateDisallowed = (date: Date) => {
    for (const unavailableDate of parsedUnavailableDates) {
      if (isEqual(unavailableDate, date)) {
        return true;
      }
    }

    return false;
  };

  return (
    <div>
      <CalendarDate
        value={value.calendarDate}
        min={today}
        max="2024-12-31"
        locale="es-ES"
        isDateDisallowed={isDateDisallowed}
        onChange={onChange}
      >
        <CalendarMonth />
      </CalendarDate>
    </div>
  );
}

function Cally() {
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
      <Picker value={value} onChange={onChange} />

      <CalendarTime onChange={onChange} timeValue={value.calendarTime} />
      <a
        type="button"
        href="/appointments-request"
        onClick={goToAppointmentForm}
      >
        Confirmar
      </a>
    </>
  );
}

export default Cally;
