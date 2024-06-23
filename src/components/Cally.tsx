import { useState, type ChangeEvent, type ReactEventHandler } from "react";
import { CalendarDate, CalendarMonth } from "./Calendar";
import { format, isEqual, parse } from "@formkit/tempo";

function Picker({
  value,
  onChange,
}: {
  value: string;
  onChange: (event: Event) => void;
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
        value={value}
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
  const [value, setValue] = useState(() => {
    const storedDate = localStorage.getItem("storedDate") || "";
    return storedDate;
  });

  const onChange = (event: Event) => {
    const e = event.target as HTMLInputElement;

    setValue(e.value);
  };

  const goToAppointmentForm = () => {
    localStorage.setItem("storedDate", value);
  };

  return (
    <>
      <p>Value is: {value}</p>
      <Picker value={value} onChange={onChange} />
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
