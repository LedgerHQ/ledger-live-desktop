import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function MobileUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.25996 22.32H16.74C17.724 22.32 18.54 21.504 18.54 20.52V3.47999C18.54 2.49599 17.724 1.67999 16.74 1.67999H7.25996C6.27596 1.67999 5.45996 2.49599 5.45996 3.47999V20.52C5.45996 21.504 6.27596 22.32 7.25996 22.32ZM6.29996 20.52V3.47999C6.29996 2.87999 6.68396 2.49599 7.28396 2.49599H16.692C17.292 2.49599 17.7 2.87999 17.7 3.47999V20.52C17.7 21.12 17.292 21.504 16.692 21.504H7.28396C6.68396 21.504 6.29996 21.12 6.29996 20.52ZM10.716 19.104C10.716 19.776 11.268 20.376 11.988 20.376C12.684 20.376 13.236 19.776 13.236 19.104C13.236 18.408 12.684 17.856 11.988 17.856C11.268 17.856 10.716 18.408 10.716 19.104ZM11.388 19.104C11.388 18.768 11.652 18.528 11.988 18.528C12.324 18.528 12.564 18.768 12.564 19.104C12.564 19.416 12.324 19.68 11.988 19.68C11.652 19.68 11.388 19.416 11.388 19.104Z"
        fill={color}
      />
    </svg>
  );
}

export default MobileUltraLight;
