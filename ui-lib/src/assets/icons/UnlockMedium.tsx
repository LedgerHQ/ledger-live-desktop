import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UnlockMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.54418 21.3599H22.3202V9.59989H12.5762V7.96789C12.5762 4.99189 10.0802 2.63989 7.12818 2.63989C4.17618 2.63989 1.68018 4.99189 1.68018 7.96789V11.3999H3.60018V7.96789C3.60018 6.04789 5.18418 4.43989 7.12818 4.43989C9.07218 4.43989 10.6562 6.04789 10.6562 7.96789V9.59989H8.54418V21.3599ZM10.4642 19.5599V11.3999H20.4002V19.5599H10.4642ZM14.4722 17.5199H16.3922V13.4399H14.4722V17.5199Z"
        fill={color}
      />
    </svg>
  );
}

export default UnlockMedium;
