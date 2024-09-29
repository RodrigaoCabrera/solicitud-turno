import React from "react";
import AM from "./AM";

interface Props {
  timeZone: string;
}
const AMTimeSelectorIcon = ({ timeZone }: Props) => {
  
  return (
    <>
      {timeZone === "AM" ? (
        <AM width="15" height="15" />
      ) : (
        <AM width="15" height="15" fill="black" stroke="black" />
      )}
    </>
  );
};

export default AMTimeSelectorIcon;
