import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import { date, format, isEqual } from "@formkit/tempo";
import AM from "./icons/AM";
import AMTimeSelectorIcon from "./icons/AMTimeSelectorIcon";
import PMTimeSelectorIcon from "./icons/PMTimeSelector";

interface Availability {
  id: number;
  dayOfWeek: number;
  startTimeAM: string;
  endTimeAM: string;
  startTimePM: string;
  endTimePM: string;
  professionalId: string;
  sessionAmount: number;
}
interface Appointments {
  id: string;
  date: Date;
  isActive: boolean;
  professionalId: string;
  patientId: string;
}

interface Props {
  availability: Availability[];
  appointments: Appointments[];
  sessionTime: number;
  value: {
    calendarDate?: string;
    calendarTime?: string;
  };
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
}
interface Slots {
  time: string;
  appointmentExist: boolean;
}
const TimeSlotSelector: React.FC<Props> = ({
  availability,
  appointments,
  sessionTime,
  value,
  onChange,
}) => {
  const [timeZone, setTimeZone] = useState<"AM" | "PM">(() => {
    if (value.calendarTime) {
      const formattedTime = format(
        new Date(`${value.calendarDate} ${value.calendarTime}`),
        "A"
      )
        .split(".")
        .join("")
        .replace(/\s+/g, "");
      return formattedTime as "AM" | "PM";
    }
    return "AM";
  });
  const [slots, setSlots] = useState<Slots[]>([]);

  const getCurrentDateAvailability = (): Availability | undefined => {
    const selectedDate = date(value.calendarDate + "T00:00:00Z");
    return availability.find(
      (availabilityDay) => availabilityDay.dayOfWeek === selectedDate.getDay()
    );
  };

  const generateTimeSlots = (
    availability: Availability,
    type: "AM" | "PM"
  ): Slots[] => {
    const startTime =
      type === "AM" ? availability.startTimeAM : availability.startTimePM;
    const endTime =
      type === "AM" ? availability.endTimeAM : availability.endTimePM;

    const start = new Date(`${value.calendarDate}T${startTime}`);
    const end = new Date(`${value.calendarDate}T${endTime}`);
    const interval = sessionTime * 60 * 1000; // Convert to milliseconds

    const newSlots = [];
    let current = new Date(start);

    while (current < end) {
      // Verify if appointment exists
      const appointmentExist = appointments.some((appointment) =>
        isEqual(current, appointment.date)
      );
      newSlots.push({
        time: current.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        appointmentExist,
      });
      current = new Date(current.getTime() + interval);
    }

    return newSlots;
  };

  useEffect(() => {
    const currentDateAvailability = getCurrentDateAvailability();
    if (currentDateAvailability) {
      setSlots(generateTimeSlots(currentDateAvailability, timeZone));
    } else {
      setSlots([]);
    }
  }, [value.calendarDate, timeZone]);

  const handletimeZoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeZone(e.target.id as "AM" | "PM");
  };

  return (
    <>
      <p className="text-sm text-[#222B45] mb-1">Horarios disponibles</p>
      <section className="time-slot-container">
        <div className="flex justify-center align-middle w-100 max-w-[196px] mx-auto border-[1px] border-solid boder-[##94A3B8] rounded-full">
          <div className="flex-1">
            <label
              htmlFor="AM"
              className={`flex gap-1 items-center justify-center rounded-full text-center text-xs h-100 ${
                timeZone === "AM" && "bg-[#94A3B8]"
              }`}
            >
              <AMTimeSelectorIcon timeZone={timeZone} />
              <span
                className={`block pt-1 ${timeZone === "AM" && "text-white"}`}
              >
                Mañana
              </span>
            </label>
            <input
              className="hidden"
              type="radio"
              name="tab"
              id="AM"
              onChange={handletimeZoneChange}
              checked={timeZone === "AM"}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="PM"
              className={`flex gap-1 items-center justify-center rounded-full text-center text-xs h-100 ${
                timeZone === "PM" && "bg-[#94A3B8]"
              }`}
            >
              <PMTimeSelectorIcon timeZone={timeZone} />

              <span
                className={`block pt-1 ${timeZone === "PM" && "text-white"}`}
              >
                Tarde
              </span>
            </label>
            <input
              className="hidden"
              type="radio"
              name="tab"
              id="PM"
              onChange={handletimeZoneChange}
              checked={timeZone === "PM"}
            />
          </div>
        </div>

        {slots.map((slot) => (
          <>
            <div className="radio-input" key={slot.time}>
              <input
                type="radio"
                id={slot.time}
                name="calendarTime"
                value={slot.time}
                onChange={onChange}
                defaultChecked={slot.time === value.calendarTime}
                disabled={slot.appointmentExist}
              />
              <label htmlFor={slot.time}>
                <span>{slot.time}</span>
              </label>
            </div>
          </>
        ))}
      </section>
    </>
  );
};

export default TimeSlotSelector;
