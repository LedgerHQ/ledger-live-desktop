import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ClaimRewardsLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25616 18.024H18.7682V16.944H16.7042C18.7682 15.504 20.0402 13.176 20.0402 10.56C20.0402 6.14402 16.4162 2.52002 12.0002 2.52002C7.58416 2.52002 3.96016 6.14402 3.96016 10.56C3.96016 13.176 5.20816 15.504 7.29616 16.944H5.25616V18.024ZM2.16016 21.48H21.8402V14.88H20.6402V20.328H3.36016V14.88H2.16016V21.48ZM5.16016 10.56C5.16016 6.76802 8.23216 3.72002 12.0002 3.72002C15.7922 3.72002 18.8402 6.76802 18.8402 10.56C18.8402 13.608 16.8242 16.152 14.0642 16.944H9.93616C7.20016 16.152 5.16016 13.608 5.16016 10.56ZM9.07216 11.616C9.04816 13.128 10.0802 14.184 11.5922 14.352V15.288H12.4322V14.352C13.8722 14.208 14.9282 13.296 14.9282 12.048C14.9282 10.896 14.0882 10.224 12.7922 10.056L11.5442 9.88802C10.6802 9.79202 10.2962 9.45602 10.2962 8.78402C10.2962 7.94402 10.9442 7.51202 12.0482 7.51202C13.2482 7.51202 13.7522 8.01602 13.7522 9.14402H14.7842C14.7842 7.77602 13.8242 6.76802 12.4322 6.62402V5.68802H11.5922V6.62402C10.2722 6.79202 9.33616 7.65602 9.33616 8.83202C9.33616 9.93602 10.0562 10.608 11.2562 10.752L12.4802 10.896C13.4402 11.016 13.8962 11.352 13.8962 12.096C13.8962 13.032 13.2722 13.464 12.0242 13.464C10.6562 13.464 10.0562 12.912 10.0562 11.616H9.07216Z"
        fill={color}
      />
    </svg>
  );
}

export default ClaimRewardsLight;
