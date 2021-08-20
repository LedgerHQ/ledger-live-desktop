import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TwoCircledFinaRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5361 16.464H13.7761V15.096L9.3601 15.12V14.76L11.8081 13.176C13.2721 12.216 13.8481 11.304 13.8481 10.176C13.8481 8.37601 12.4081 7.34401 10.6321 7.34401C8.6641 7.34401 7.3441 8.66401 7.3441 10.176V10.464H8.8801V10.2C8.8801 9.24001 9.3121 8.71201 10.5601 8.71201H10.6801C11.7841 8.71201 12.2881 9.14401 12.2881 10.224C12.2881 10.968 12.0481 11.496 10.4401 12.552L7.5361 14.472V16.464ZM4.1521 21.24H10.6081C15.7921 21.24 19.8481 17.016 19.8481 12C19.8481 6.84001 15.7681 2.76001 10.6081 2.76001H4.1521V4.32001H10.6081C14.9281 4.32001 18.2881 7.68001 18.2881 12C18.2881 16.176 14.9281 19.68 10.6081 19.68H4.1521V21.24Z"
        fill={color}
      />
    </svg>
  );
}

export default TwoCircledFinaRegular;
