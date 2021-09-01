import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SevenCircledFinaRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.85585 16.464H10.6559C10.8959 13.368 11.9759 10.92 13.9919 8.97601V7.58401H7.27186V8.95201H12.1199V9.26401C10.2239 11.424 9.16786 13.8 8.85585 16.464ZM4.15186 21.24H10.6079C15.7919 21.24 19.8479 17.016 19.8479 12C19.8479 6.84001 15.7679 2.76001 10.6079 2.76001H4.15186V4.32001H10.6079C14.9279 4.32001 18.2879 7.68001 18.2879 12C18.2879 16.176 14.9279 19.68 10.6079 19.68H4.15186V21.24Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledFinaRegular;
