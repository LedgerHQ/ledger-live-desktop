import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CubeMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 22.3199L20.9759 17.0879V6.91193L11.9999 1.67993L3.02393 6.91193V17.0879L11.9999 22.3199ZM4.94393 16.0799V8.99993L11.1119 12.5279V19.6799L4.94393 16.0799ZM5.80793 7.41593L11.9999 3.79193L18.1919 7.41593L11.9999 10.9679L5.80793 7.41593ZM12.9119 19.6799V12.5279L19.0559 8.99993V16.0799L12.9119 19.6799Z"
        fill={color}
      />
    </svg>
  );
}

export default CubeMedium;
