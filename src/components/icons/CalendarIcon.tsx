import React from "react";

interface Props {
  width: string;
  height: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
}
const CalendarIcon = (props: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        opacity="0.12"
        d="M2.65479 6.10645C2.65479 5.05635 2.65479 4.5313 2.85915 4.13021C3.03891 3.77741 3.32575 3.49057 3.67855 3.31081C4.07964 3.10645 4.60469 3.10645 5.65479 3.10645H10.9048C11.9549 3.10645 12.4799 3.10645 12.881 3.31081C13.2338 3.49057 13.5207 3.77741 13.7004 4.13021C13.9048 4.5313 13.9048 5.05635 13.9048 6.10645V6.85645H2.65479V6.10645Z"
        fill="black"
      />
      <path
        d="M13.9048 6.85645H2.65479M10.7798 1.85645V4.35645M5.77979 1.85645V4.35645M5.65478 14.3564H10.9048C11.9549 14.3564 12.4799 14.3564 12.881 14.1521C13.2338 13.9723 13.5207 13.6855 13.7004 13.3327C13.9048 12.9316 13.9048 12.4065 13.9048 11.3564V6.10645C13.9048 5.05635 13.9048 4.5313 13.7004 4.13021C13.5207 3.77741 13.2338 3.49057 12.881 3.31081C12.4799 3.10645 11.9549 3.10645 10.9048 3.10645H5.65479C4.60469 3.10645 4.07964 3.10645 3.67855 3.31081C3.32575 3.49057 3.03891 3.77741 2.85915 4.13021C2.65479 4.5313 2.65479 5.05635 2.65479 6.10645V11.3564C2.65479 12.4065 2.65479 12.9316 2.85915 13.3327C3.03891 13.6855 3.32575 13.9723 3.67855 14.1521C4.07964 14.3564 4.60469 14.3564 5.65478 14.3564Z"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default CalendarIcon;
