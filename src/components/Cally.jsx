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
  const availableDates = [
    "2024-06-20",
    "2024-06-22",
    "2024-06-28",
    "2024-06-01",
  ];

  // Available date in ISO format
  const parsedAvailableDates = availableDates.map((date) => {
    const parsedDate = parse(date);
    parsedDate.setUTCHours(0, 0, 0, 0);
    return parsedDate;
  });

  const isDateDisallowed = (date) => {
    for (const availableDate of parsedAvailableDates) {
      if (isEqual(availableDate, date)) {
        return false;
      }
    }

    return true;
  };

  return (
    <div>
      <CalendarDate
        value={value}
        min={today}
        max="2024-12-31"
        locale="es-ES"
        isDateDisallowed={isDateDisallowed}
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
