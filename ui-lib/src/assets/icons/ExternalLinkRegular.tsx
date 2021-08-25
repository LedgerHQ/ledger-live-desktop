import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ExternalLinkRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.75977 21.24L19.3198 21.216V12H17.7598V19.656L4.31977 19.68V6.24001H11.9998V4.68001H2.75977V21.24ZM10.6558 12.288L11.7118 13.344L19.9198 5.13601C19.8958 5.83201 19.8718 6.50401 19.8718 7.20001V8.92801H21.2398V2.76001H15.0958V4.12801H16.8238C17.4718 4.12801 18.1678 4.12801 18.8398 4.10401L10.6558 12.288Z"
        fill={color}
      />
    </svg>
  );
}

export default ExternalLinkRegular;
