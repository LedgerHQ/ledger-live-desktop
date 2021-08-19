import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UndelegateLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.26806 9.36005L20.6761 21.7681L21.4921 20.9521L2.77205 2.23206L1.95605 3.04806L7.42806 8.49606C6.66006 9.48006 6.18006 10.6801 6.18006 12.0001V20.4001H7.38005V12.0001C7.38005 10.9681 7.69206 10.0801 8.26806 9.36005ZM10.4281 6.62406L11.4601 7.63206H11.7721H20.0041C19.4761 8.13606 18.9241 8.66406 18.4201 9.16806L16.9561 10.6561L17.7001 11.4001L22.0441 7.05606L17.7001 2.71206L16.9561 3.48006L18.4201 4.94406C18.9241 5.44806 19.4521 5.97606 19.9801 6.48006H11.7241C11.2681 6.48006 10.8361 6.52806 10.4281 6.62406Z"
        fill={color}
      />
    </svg>
  );
}

export default UndelegateLight;
