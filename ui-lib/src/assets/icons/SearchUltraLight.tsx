import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SearchUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.3841 15.984L21.1921 21.816L21.8161 21.192L15.9841 15.384C17.2561 13.968 18.0241 12.12 18.0241 10.104C18.0241 5.73601 14.4721 2.18401 10.1041 2.18401C5.73608 2.18401 2.18408 5.73601 2.18408 10.104C2.18408 14.472 5.73608 18.024 10.1041 18.024C12.1201 18.024 13.9681 17.256 15.3841 15.984ZM3.02408 10.104C3.02408 6.19201 6.21608 3.02401 10.1041 3.02401C14.0161 3.02401 17.1841 6.19201 17.1841 10.104C17.1841 13.992 14.0161 17.184 10.1041 17.184C6.21608 17.184 3.02408 13.992 3.02408 10.104Z"
        fill={color}
      />
    </svg>
  );
}

export default SearchUltraLight;
