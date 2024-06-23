import { useState } from "react";
import { CalendarDate, CalendarMonth } from "./Calendar";
import { format, isEqual, parse } from "@formkit/tempo";

function Picker({ value, onChange }) {
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

  const isDateDisallowed = (date) => {
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
  const [value, setValue] = useState("");

  const onChange = (event) => setValue(event.target.value);

  return (
    <>
      <p>Value is: {value}</p>
      <Picker value={value} onChange={onChange} />
    </>
  );
}

export default Cally;
