import React, { ChangeEvent } from "react";

interface Props {
  onChange: (event: Event | ChangeEvent<HTMLInputElement>) => void;
  modality: string;
}
const AppointmentModality: React.FC<Props> = ({ onChange, modality }) => {
  return (
    <section>
      <input
        type="radio"
        name="modality"
        id="face-to-face"
        value="face-to-face"
        onChange={onChange}
        defaultChecked={modality === "face-to-face"}
      />
      <label htmlFor="face-to-face">PRESENCIAL</label>

      <input
        type="radio"
        name="modality"
        id="online"
        value="online"
        onChange={onChange}
        defaultChecked={modality === "online"}
      />
      <label htmlFor="online">ONLINE</label>
    </section>
  );
};

export default AppointmentModality;
