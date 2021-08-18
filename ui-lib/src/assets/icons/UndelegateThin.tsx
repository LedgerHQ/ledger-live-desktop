import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UndelegateThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.10017 8.83198L20.7962 21.528L21.1322 21.192L2.41217 2.47198L2.07617 2.80798L7.76417 8.49599C6.92417 9.43198 6.42017 10.656 6.42017 12V20.4H6.90017V12C6.90017 10.776 7.33217 9.69598 8.10017 8.83198ZM10.5722 6.88798L11.0042 7.31998C11.1962 7.29598 11.4122 7.29598 11.6042 7.29598H21.0122L19.1162 9.19199L17.2442 11.064L17.5802 11.4L21.9242 7.05598L17.5802 2.71198L17.2442 3.04798L19.1162 4.91998L21.0122 6.81598H11.6042C11.2442 6.81598 10.9082 6.83998 10.5722 6.88798Z"
        fill={color}
      />
    </svg>
  );
}

export default UndelegateThin;
