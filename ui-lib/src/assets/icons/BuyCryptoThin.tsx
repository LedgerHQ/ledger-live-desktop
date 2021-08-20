import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BuyCryptoThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.63993 12H3.11993V6.33601H21.4079L19.5119 8.23201L17.6399 10.104L17.9759 10.44L22.3199 6.09601L17.9759 1.75201L17.6399 2.08801L19.5119 3.96001L21.4079 5.85601H2.63993V12ZM1.67993 17.904L6.02393 22.248L6.35993 21.912L4.48793 20.04L2.59193 18.144H21.3599V12H20.8799V17.664H2.59193L4.48793 15.768L6.35993 13.896L6.02393 13.56L1.67993 17.904Z"
        fill={color}
      />
    </svg>
  );
}

export default BuyCryptoThin;
