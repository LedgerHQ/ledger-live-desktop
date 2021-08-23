import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NanoFoldedThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.16016 20.928H18.2402C20.1842 20.928 21.8402 19.296 21.8402 17.304C21.8402 16.176 21.3362 15.288 20.4962 14.448L9.12016 3.07202L4.10416 8.06402L9.76816 13.704H2.16016V20.928ZM2.64016 20.448V14.184H18.2402C19.9682 14.184 21.3602 15.552 21.3602 17.304C21.3602 19.08 19.9682 20.448 18.2402 20.448H2.64016ZM4.77616 8.06402L9.12016 3.74402L19.1522 13.824C18.8642 13.752 18.5522 13.704 18.2402 13.704H10.4402L4.77616 8.06402ZM16.2962 17.304C16.2962 18.264 17.0882 19.128 18.1202 19.128C19.0802 19.128 19.8722 18.264 19.8722 17.304C19.8722 16.32 19.0802 15.528 18.1202 15.528C17.0882 15.528 16.2962 16.32 16.2962 17.304ZM16.7762 17.304C16.7762 16.584 17.3522 16.008 18.1202 16.008C18.8162 16.008 19.3922 16.584 19.3922 17.304C19.3922 18.024 18.8162 18.648 18.1202 18.648C17.3522 18.648 16.7762 18.024 16.7762 17.304Z"
        fill={color}
      />
    </svg>
  );
}

export default NanoFoldedThin;
