import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import { date } from "@formkit/tempo";

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

interface Props {
  availability: Availability[];
  sessionTime: number;
  value: {
    calendarDate: string;
    calendarTime: string;
  };
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
}

const TimeSlotSelector: React.FC<Props> = ({
  availability,
  sessionTime,
  value,
  onChange,
}) => {
  const [timeType, setTimeType] = useState<"AM" | "PM">("AM");
  const [slots, setSlots] = useState<string[]>([]);

  const getCurrentDateAvailability = (): Availability | undefined => {
    if (!value.calendarDate) {
      return;
    }
    const currDate = date(value.calendarDate + "T00:00:00Z");
    return availability.find(
      (availabilityDay) => availabilityDay.dayOfWeek === currDate.getDay()
    );
  };

  const generateTimeSlots = (
    availability: Availability,
    type: "AM" | "PM"
  ): string[] => {
    const startTime =
      type === "AM" ? availability.startTimeAM : availability.startTimePM;
    const endTime =
      type === "AM" ? availability.endTimeAM : availability.endTimePM;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const interval = sessionTime * 60 * 1000; // Convert to milliseconds

    const newSlots = [];
    let current = new Date(start);
    while (current < end) {
      newSlots.push(
        current.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
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

  const currentDateAvailability = getCurrentDateAvailability();

  if (!currentDateAvailability) {
    return <p>No hay disponibilidad para la fecha seleccionada.</p>;
  }

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

      {slots.map((slot, index) => (
        <>
          <div className="radio-input" key={index}>
            <label>
              <input
                type="radio"
                id={slot}
                name="calendarTime"
                value={slot}
                onChange={onChange}
                defaultChecked={slot === value.calendarTime}
              />
              <span>{slot}</span>
            </label>
            <span className="selection"></span>
          </div>
        </>
      ))}
    </section>
  );
};

export default TimeSlotSelector;
