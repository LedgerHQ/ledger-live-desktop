import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SevenCircledInitUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.6041 16.44H12.5641C12.9001 13.248 14.1721 10.608 16.2841 8.76V7.584H9.80411V8.352H15.3241V8.712C13.2121 10.728 11.9641 13.392 11.6041 16.44ZM4.06812 12C4.06812 17.04 8.02812 21 13.0681 21H19.9321V20.16H13.0681C8.50811 20.16 4.90812 16.56 4.90812 12C4.90812 7.536 8.50811 3.84 13.0681 3.84H19.9321V3H13.0681C8.02812 3 4.06812 7.08 4.06812 12Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledInitUltraLight;
