import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CoffeeMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.90392 15.9601H11.8559C13.4639 15.9601 14.8559 15.3601 15.8399 14.0641C15.9359 13.9441 16.0319 13.8241 16.1039 13.7041H17.0639C19.9439 13.7041 22.0799 11.8081 22.0799 9.16806C22.0799 6.45606 19.9439 4.56006 17.0639 4.56006H3.83992V10.0801C3.83992 11.9041 4.17592 13.1041 4.94392 14.0641C5.95192 15.3601 7.29592 15.9601 8.90392 15.9601ZM1.91992 17.5201C1.91992 18.5761 2.78392 19.4401 3.83992 19.4401H17.9999C19.0799 19.4401 19.9199 18.5761 19.9199 17.5201H1.91992ZM5.87992 11.4001V6.36006H14.8799V11.4001C14.8799 13.3681 14.1359 14.0401 12.0719 14.0401H8.71192C6.62392 14.0401 5.87992 13.3681 5.87992 11.4001ZM16.7759 11.9041C16.8719 11.3761 16.9199 10.7761 16.9199 10.0801V6.36006C19.3439 6.36006 20.0399 6.79206 20.0399 8.59206V9.69606C20.0399 11.4001 19.4159 11.9041 17.2079 11.9041H16.7759Z"
        fill={color}
      />
    </svg>
  );
}

export default CoffeeMedium;
