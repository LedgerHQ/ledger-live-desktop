import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MicrochipRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.82377 21.24H9.21577V17.88H11.3038V21.24H12.6958V17.88H14.7838V21.24H16.1758V17.88H17.8798V16.176H21.2398V14.784H17.8798V12.696H21.2398V11.304H17.8798V9.21601H21.2398V7.82401H17.8798V6.12001H16.1758V2.76001H14.7838V6.12001H12.6958V2.76001H11.3038V6.12001H9.21577V2.76001H7.82377V6.12001H6.11977V7.82401H2.75977V9.21601H6.11977V11.304H2.75977V12.696H6.11977V14.784H2.75977V16.176H6.11977V17.88H7.82377V21.24ZM7.58377 16.416V7.58401H16.4158V16.416H7.58377ZM10.2958 13.704H13.7038V10.296H10.2958V13.704Z"
        fill={color}
      />
    </svg>
  );
}

export default MicrochipRegular;
