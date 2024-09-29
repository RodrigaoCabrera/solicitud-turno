import React from "react";
import PM from "./PM";

interface Props {
  timeZone: string;
}
const PMTimeSelectorIcon = ({ timeZone }: Props) => {

  return (
    <>
      {timeZone === "PM" ? (
        <PM width="15" height="15" />
      ) : (
        <PM width="15" height="15" fill="black" stroke="black" />
      )}
    </>
  );
};

export default PMTimeSelectorIcon;
