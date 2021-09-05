import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ImportRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.75977 20.34H21.2398V13.26H19.6798V18.78H4.31977V13.26H2.75977V20.34ZM7.63177 12.276L11.9998 16.62L16.3438 12.276L15.3598 11.316L14.1118 12.564C13.6558 13.02 13.1998 13.5 12.7438 13.98V3.66003H11.2558V14.004C10.7998 13.524 10.3438 13.02 9.88777 12.564L8.61577 11.316L7.63177 12.276Z"
        fill={color}
      />
    </svg>
  );
}

export default ImportRegular;
