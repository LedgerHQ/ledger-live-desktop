import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ServerRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.12012 21.36H10.3201V14.4H7.41612V12.696H16.6081V14.4H13.6801V21.36H20.8801V14.4H17.9761V11.304H12.6961V9.60002H15.6001V2.64001H8.40012V9.60002H11.3041V11.304H6.02412V14.4H3.12012V21.36ZM4.58412 19.968V15.768H8.85612V19.968H4.58412ZM9.86412 8.20801V4.00801H14.1361V8.20801H9.86412ZM15.1441 19.968V15.768H19.4161V19.968H15.1441Z"
        fill={color}
      />
    </svg>
  );
}

export default ServerRegular;
