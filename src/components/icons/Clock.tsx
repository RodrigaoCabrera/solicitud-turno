import React from "react";

interface Props {
  width: string;
  height: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
}

const Clock = (props: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clip-path="url(#clip0_96_5136)">
        <path
          opacity="0.12"
          d="M8.27979 14.3564C11.7316 14.3564 14.5298 11.5582 14.5298 8.10645C14.5298 4.65467 11.7316 1.85645 8.27979 1.85645C4.82801 1.85645 2.02979 4.65467 2.02979 8.10645C2.02979 11.5582 4.82801 14.3564 8.27979 14.3564Z"
          fill="black"
        />
        <path
          d="M8.27979 4.35645V8.10645L10.7798 9.35645M14.5298 8.10645C14.5298 11.5582 11.7316 14.3564 8.27979 14.3564C4.82801 14.3564 2.02979 11.5582 2.02979 8.10645C2.02979 4.65467 4.82801 1.85645 8.27979 1.85645C11.7316 1.85645 14.5298 4.65467 14.5298 8.10645Z"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_96_5136">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="translate(0.779785 0.606445)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Clock;
