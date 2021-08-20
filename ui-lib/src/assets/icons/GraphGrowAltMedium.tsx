import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GraphGrowAltMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.16016 20.2321H20.8802V18.3601H4.08016V4.39207H2.16016V20.2321ZM5.78416 15.3361L10.4402 10.7041L13.3202 13.5841L20.2322 6.67207C20.1842 7.27207 20.1602 7.84807 20.1602 8.42407V9.93607H21.8402L21.8162 3.76807H15.6722V5.44807H17.1842C17.7362 5.44807 18.3362 5.44807 18.9122 5.40007L13.3202 10.9921L10.4402 8.11207L5.78416 12.7441V15.3361Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowAltMedium;
