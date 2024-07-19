import React, { ChangeEvent } from "react";

interface Props {
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
  modality: string;
}
const AppointmentModality: React.FC<Props> = ({ onChange, modality }) => {
  return (
    <>
      <p className="text-sm text-[#222B45] mb-1">Modalidad</p>
      <section className="flex w-100 gap-3">
        <div className="flex-1">
          <label
            htmlFor="face-to-face"
            className={`flex flex-col align-bottom justify-center rounded-full border-[1px] border-solid boder-[#94A3B8]  pt-1 text-center ${
              modality === "face-to-face" && "bg-gray-100"
            }`}
          >
            PRESENCIAL
          </label>
          <input
            className="hidden"
            type="radio"
            name="modality"
            id="face-to-face"
            value="face-to-face"
            onChange={onChange}
            defaultChecked={modality === "face-to-face"}
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="online"
            className={`flex flex-col align-bottom justify-center rounded-full border-[1px] border-solid boder-[#94A3B8] pt-1 text-center  ${
              modality === "online" && "bg-gray-100"
            }`}
          >
            ONLINE
          </label>
          <input
            className="hidden"
            type="radio"
            name="modality"
            id="online"
            value="online"
            onChange={onChange}
            defaultChecked={modality === "online"}
          />
        </div>
      </section>
    </>
  );
};

export default AppointmentModality;
