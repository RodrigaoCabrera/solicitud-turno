import React from "react";

interface Props {
  width: string;
  height: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
}

const CloseIcon = (props: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14.25 4.75L4.75 14.25M4.75 4.75L14.25 14.25"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
