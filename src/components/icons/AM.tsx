import React from "react";

interface Props {
  width: string;
  height: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
}
const AM = ({ fill = "white", stroke = "white", ...props }: Props) => {
  return (
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 15 15"
        {...props}
        fill="none"
      >
        <g clip-path="url(#clip0_244_1291)">
          <path
            opacity="0.12"
            d="M7.5 8.125C5.77411 8.125 4.375 9.52411 4.375 11.25H10.625C10.625 9.52411 9.22589 8.125 7.5 8.125Z"
            fill={fill}
          />
          <path
            d="M2.5 11.25H1.25M3.94632 7.69632L3.06244 6.81244M11.0536 7.69632L11.9375 6.81244M13.75 11.25H12.5M4.375 11.25C4.375 9.52411 5.77411 8.125 7.5 8.125C9.22589 8.125 10.625 9.52411 10.625 11.25M13.75 13.75H1.25M10 3.75L7.5 1.25M7.5 1.25L5 3.75M7.5 1.25V5.625"
            stroke={stroke}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_244_1291">
            <rect width="15" height="15" fill={fill} />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default AM;
