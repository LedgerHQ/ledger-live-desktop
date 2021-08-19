import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ManagerUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.02018 20.028V13.98H10.0202V20.028H4.02018ZM3.18018 20.82H10.8602V13.188H3.18018V20.82ZM3.18018 10.836H10.8602V3.17999H3.18018V10.836ZM4.02018 10.02V3.99599H10.0202V10.02H4.02018ZM13.1402 20.82H20.8202V13.188H13.1402V20.82ZM13.1402 10.836H20.8202V3.20399H13.1402V10.836ZM13.9802 20.028V13.98H19.9802V20.028H13.9802ZM13.9802 10.044V3.99599H19.9802V10.044H13.9802Z"
        fill={color}
      />
    </svg>
  );
}

export default ManagerUltraLight;
