import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PhoneMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0962 21.8399L21.8402 17.9519L15.9362 12.6479L11.6642 16.8479C10.8242 16.2239 10.0082 15.5279 9.24016 14.7599C8.49616 13.9919 7.77616 13.1759 7.15216 12.3359L11.3522 8.06391L6.04816 2.15991L2.16016 5.92791C2.88016 9.64791 5.08816 13.2719 7.89616 16.1039C10.7522 18.9359 14.3282 21.1439 18.0962 21.8399ZM4.27216 6.55191L5.95216 4.94391L8.71216 8.01591L6.07216 10.7039C5.28016 9.38391 4.65616 7.99191 4.27216 6.55191ZM13.2722 17.9519L15.9842 15.2879L19.0562 18.0479L17.4482 19.7279C16.0082 19.3439 14.6162 18.7439 13.2722 17.9519Z"
        fill={color}
      />
    </svg>
  );
}

export default PhoneMedium;
