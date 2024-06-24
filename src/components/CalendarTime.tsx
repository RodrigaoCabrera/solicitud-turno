import React, { ChangeEvent } from "react";

import { format } from "@formkit/tempo";
interface CalendarTimeProps {
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
  timeValue: string;
}

const CalendarTime: React.FC<CalendarTimeProps> = ({ onChange, timeValue }) => {
  console.log({ timeValue });
  return (
    <>
      <input
        type="time"
        name="Calendar time"
        id="calendarTime"
        value={timeValue}
        min="09:00"
        max="18:00"
        onChange={onChange}
        required
      />
    </>
  );
};

export default CalendarTime;
