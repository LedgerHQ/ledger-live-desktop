import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TpUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 20.988C16.968 20.988 21 16.98 21 12.012C21 7.04399 16.968 3.01199 12 3.01199C7.032 3.01199 3 7.04399 3 12.012C3 16.98 7.032 20.988 12 20.988ZM5.616 8.81999V8.07599H12.048V8.81999H9.216V16.428H8.448V8.81999H5.616ZM13.152 16.428V8.07599H16.152C17.76 8.07599 18.864 9.13199 18.864 10.62C18.864 12.06 17.76 13.116 16.152 13.116H13.944V16.428H13.152ZM13.944 12.372H16.2C17.4 12.372 18.048 11.724 18.048 10.692V10.524C18.048 9.46799 17.4 8.81999 16.2 8.81999H13.944V12.372Z"
        fill={color}
      />
    </svg>
  );
}

export default TpUltraLight;
