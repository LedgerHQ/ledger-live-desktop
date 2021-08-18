import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BlockchainUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.50391 19.224L7.94391 21.816L11.9999 19.464L16.0559 21.816L20.4959 19.224V14.136L16.8239 12L20.4959 9.864V4.776L16.0559 2.184L11.9999 4.536L7.94391 2.184L3.50391 4.776V9.864L7.17591 12L3.50391 14.136V19.224ZM4.27191 18.792V14.952L7.60791 16.872V20.712L4.27191 18.792ZM4.27191 9.432V5.592L7.60791 7.512V11.352L4.27191 9.432ZM4.60791 14.376L7.99191 12.408L11.3519 14.352L7.94391 16.296L4.60791 14.376ZM4.60791 5.016L7.94391 3.096L11.2799 5.016L7.94391 6.936L4.60791 5.016ZM8.27991 20.712V16.872L11.6639 14.928V18.744L8.27991 20.712ZM8.27991 11.424V7.512L11.6639 5.568V9.456L8.27991 11.424ZM8.59191 12L11.9999 10.032L15.4079 12L11.9999 13.968L8.59191 12ZM12.3359 18.744V14.928L15.7199 16.872V20.712L12.3359 18.744ZM12.3359 9.456V5.568L15.7199 7.512V11.424L12.3359 9.456ZM12.6479 14.352L16.0079 12.408L19.3919 14.376L16.0559 16.296L12.6479 14.352ZM12.7199 5.016L16.0559 3.096L19.3919 5.016L16.0559 6.936L12.7199 5.016ZM16.3919 20.712V16.872L19.7279 14.952V18.792L16.3919 20.712ZM16.3919 11.352V7.512L19.7279 5.592V9.432L16.3919 11.352Z"
        fill={color}
      />
    </svg>
  );
}

export default BlockchainUltraLight;
