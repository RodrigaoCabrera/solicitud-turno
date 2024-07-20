import CalendarIcon from "@/components/icons/CalendarIcon";
import Clock from "@/components/icons/Clock";
import Office from "@/components/icons/Office";
import { format } from "@formkit/tempo";
import React from "react";
interface Appointmentdate {
  calendarDate: string;
  calendarTime: string;
  modality: string;
}

interface Props {
  value: Appointmentdate;
  professionalAddress: string;
}

const Card: React.FC<Props> = ({ value, professionalAddress }) => {
  const { calendarDate, calendarTime, modality } = value;

  const selectedDate = new Date(`${calendarDate} ${calendarTime}`);

  if (!calendarDate || !calendarDate) {
    return <p>No hay una fecha seleccionada</p>;
  }

  if (!professionalAddress) {
    professionalAddress = localStorage.getItem("professionalAddress") || "";
  }

  const appointmentDate = format(selectedDate, "full");

  const appointmentTime = format(selectedDate, "HH:mm");
  return (
    <ul>
      <li className="flex items-center gap-3">
        <span>
          <CalendarIcon
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          />
        </span>
        <span className="max-h-4 text-xs">{appointmentDate}</span>
      </li>
      <li className="flex items-center gap-3 mt-1">
        <span>
          <Clock width="16" height="16" viewBox="0 0 16 16" fill="none" />
        </span>
        <span className="max-h-4 text-xs">{appointmentTime}h</span>
      </li>
      <li className="flex gap-3 mt-1">
        <span className="">
          <Office width="16" height="16" viewBox="0 0 16 16" fill="none" />
        </span>
        <span className="text-xs capitalize">
          {modality === "face-to-face" ? "Presencial" : modality} - Consultorio:{" "}
          {professionalAddress}
        </span>
      </li>
    </ul>
  );
};

export default Card;
