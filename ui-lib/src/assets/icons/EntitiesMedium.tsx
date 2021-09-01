import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function EntitiesMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.68018 21.3599H7.68018V15.3599H5.52018V12.8399H11.1602V15.3599H9.00018V21.3599H15.0002V15.3599H12.8402V12.8399H18.4802V15.3599H16.3202V21.3599H22.3202V15.3599H20.1602V11.1599H12.8402V8.63989H15.0002V2.63989H9.00018V8.63989H11.1602V11.1599H3.84018V15.3599H1.68018V21.3599ZM3.36018 19.7519V16.9679H6.00018V19.7519H3.36018ZM10.6802 19.7519V16.9679H13.3202V19.7519H10.6802ZM10.6802 7.03189V4.24789H13.3202V7.03189H10.6802ZM18.0002 19.7519V16.9679H20.6402V19.7519H18.0002Z"
        fill={color}
      />
    </svg>
  );
}

export default EntitiesMedium;
