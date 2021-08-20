import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TransferUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0159 12.288L21.3599 7.94401L17.0159 3.60001L16.4639 4.15201L18.1439 5.80801C18.6959 6.38401 19.2959 6.96001 19.8719 7.53601H3.59989V8.35201H19.8959C19.2959 8.92801 18.7199 9.50401 18.1439 10.08L16.4639 11.736L17.0159 12.288ZM2.63989 16.056L6.98389 20.4L7.53589 19.848L5.85589 18.168C5.30389 17.616 4.70389 17.016 4.12789 16.464H20.3999V15.648H4.12789C4.70389 15.072 5.30389 14.496 5.85589 13.92L7.53589 12.24L6.98389 11.712L2.63989 16.056Z"
        fill={color}
      />
    </svg>
  );
}

export default TransferUltraLight;
