import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ServerMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.12012 21.3599H10.3201V14.3999H7.56012V12.8399H16.4401V14.3999H13.6801V21.3599H20.8801V14.3999H18.1201V11.1599H12.8401V9.59989H15.6001V2.63989H8.40012V9.59989H11.1601V11.1599H5.88012V14.3999H3.12012V21.3599ZM4.92012 19.6799V16.0799H8.52012V19.6799H4.92012ZM10.2001 7.91989V4.31989H13.8001V7.91989H10.2001ZM15.4801 19.6799V16.0799H19.0801V19.6799H15.4801Z"
        fill={color}
      />
    </svg>
  );
}

export default ServerMedium;
