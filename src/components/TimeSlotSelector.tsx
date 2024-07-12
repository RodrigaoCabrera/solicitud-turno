import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import { date, format, isEqual } from "@formkit/tempo";

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
  const [timeType, setTimeType] = useState<"AM" | "PM">(() => {
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
      setSlots(generateTimeSlots(currentDateAvailability, timeType));
    } else {
      setSlots([]);
    }
  }, [value.calendarDate, timeType]);

  const handleTimeTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeType(e.target.id as "AM" | "PM");
  };

  return (
    <section className="time-slot-container">
      <div>
        <label htmlFor="AM">AM</label>
        <input
          type="radio"
          name="tab"
          id="AM"
          onChange={handleTimeTypeChange}
          checked={timeType === "AM"}
        />
        <label htmlFor="PM">PM</label>
        <input
          type="radio"
          name="tab"
          id="PM"
          onChange={handleTimeTypeChange}
          checked={timeType === "PM"}
        />
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
  );
};

export default TimeSlotSelector;
