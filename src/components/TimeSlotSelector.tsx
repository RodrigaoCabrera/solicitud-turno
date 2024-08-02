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
  date: string;
  time: string;
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
  existAppointment: boolean;
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
    const selectedDate = date(value.calendarDate);

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

    // TODO: Converter date to local hour
    const startDate = date(`${value.calendarDate} ${startTime}`);
    const endDate = date(`${value.calendarDate} ${endTime}`);
    const interval = sessionTime * 60 * 1000; // Convert to milliseconds

    const newSlots = [];
    let current = startDate;
    while (current < endDate) {
      // Verify if appointment exists
      const existAppointment = appointments.some((appointment) => {
        const appointmentDate = `${appointment.date} ${appointment.time}`;
        const currentDate = format({
          date: current,
          format: "YYYY-MM-DD HH:mm",
          tz: "America/Argentina/Buenos_Aires",
        });

        return isEqual(appointmentDate, currentDate);
      });
      newSlots.push({
        time: format(current, "HH:mm"),
        existAppointment,
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
    <section>
      <p className="text-sm text-[#222B45] mb-1">Horarios disponibles</p>
      <section className="time-slot-container">
        {/* Tabs item */}
        <div className="flex justify-center align-middle w-100 max-w-[196px] mx-auto border-[1px] border-solid boder-[##94A3B8] rounded-full">
          <div className="flex-1">
            <label
              htmlFor="AM"
              className={`flex gap-1 items-center justify-center rounded-full text-center text-xs h-100 select-none ${
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
              className={`flex gap-1 items-center justify-center rounded-full text-center text-xs h-100 select-none ${
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

        {/* Tabs items */}
        <div className="flex justify-center gap-3 flex-wrap w-100 mx-auto mt-3">
          {slots.map((slot) => (
            <div className="radio-input flex-1 max-w-[78px]" key={slot.time}>
              <input
                className="hidden"
                type="radio"
                id={slot.time}
                name="calendarTime"
                value={slot.time}
                onChange={onChange}
                defaultChecked={slot.time === value.calendarTime}
                disabled={slot.existAppointment}
              />
              <label
                htmlFor={slot.time}
                className={`flex gap-1 items-center justify-center rounded-full text-center text-xs h-100 border-[1px] border-solid boder-[#94A3B8] pt-2 px-2 pb-1 select-none ${
                  slot.time === value.calendarTime &&
                  "bg-[#D9D9D9] font-semibold"
                } ${slot.existAppointment && "text-[#94A3B8]"}`}
              >
                <span>{slot.time}h</span>
              </label>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default TimeSlotSelector;
