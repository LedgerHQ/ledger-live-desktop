import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function RefreshUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 11.856V12.288H3.84V11.856C3.84 7.392 7.464 3.84 11.976 3.84C14.976 3.84 17.616 5.52 19.056 8.016C18.288 8.016 17.448 7.992 16.632 7.992H14.256V8.784H20.4V2.64H19.632V5.016V7.464C18 4.728 15.12 3 11.976 3C6.984 3 3 6.912 3 11.856ZM3.6 21.36H4.392V18.984C4.392 18.216 4.368 17.376 4.368 16.536C6 19.272 8.88 21 12.024 21C17.016 21 21 17.064 21 12.144V11.712H20.16V12.144C20.16 16.608 16.56 20.16 12.024 20.16C9.024 20.16 6.384 18.456 4.944 15.984H7.368H9.744V15.216H3.6V21.36Z"
        fill={color}
      />
    </svg>
  );
}

export default RefreshUltraLight;
