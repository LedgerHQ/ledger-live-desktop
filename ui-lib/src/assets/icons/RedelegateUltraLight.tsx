import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function RedelegateUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64018 8.184V12H3.45618V8.184C3.45618 7.392 4.29618 6.504 5.13618 6.504H20.8562C20.2562 7.08 19.6802 7.656 19.1042 8.232L17.4242 9.888L17.9762 10.44L22.3202 6.096L17.9762 1.752L17.4242 2.304L19.1042 3.96C19.6562 4.536 20.2562 5.112 20.8322 5.688H5.13618C3.88818 5.688 2.64018 6.984 2.64018 8.184ZM1.68018 17.904L6.02418 22.248L6.57618 21.696L4.89618 20.016C4.34418 19.464 3.74418 18.864 3.16818 18.312H18.8642C20.1122 18.312 21.3602 16.992 21.3602 15.816V12H20.5442V15.816C20.5442 16.608 19.7042 17.496 18.8642 17.496H3.16818C3.74418 16.92 4.34418 16.344 4.89618 15.768L6.57618 14.088L6.02418 13.56L1.68018 17.904Z"
        fill={color}
      />
    </svg>
  );
}

export default RedelegateUltraLight;
