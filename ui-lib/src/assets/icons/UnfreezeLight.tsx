import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function UnfreezeLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.9641 21.756L21.7561 20.964L3.03614 2.24402L2.24414 3.03602L10.6201 11.412L7.47614 11.388L4.81214 8.74802L4.09214 9.46802L6.10814 11.436L2.70014 11.388V12.468L6.10814 12.444L4.09214 14.412L4.81214 15.132L7.47614 12.468L10.8601 12.444L5.43614 17.844L6.15614 18.564L11.5561 13.14L11.5321 16.524L8.86814 19.188L9.58814 19.908L11.5561 17.892L11.5321 21.3H12.6121L12.5641 17.892L14.5321 19.908L15.2521 19.188L12.6121 16.524L12.5881 13.38L20.9641 21.756ZM8.86814 4.69202L12.5881 8.41202L12.6121 7.33202L15.2521 4.69202L14.5321 3.97202L12.5641 5.96402L12.6121 2.58002H11.5321L11.5561 5.96402L9.58814 3.97202L8.86814 4.69202ZM13.7401 9.56402L14.4361 10.26L18.6841 6.03602L17.9641 5.31602L13.7401 9.56402ZM15.5881 11.412L19.3081 15.132L20.0281 14.412L18.0361 12.444L21.4201 12.468V11.388L18.0361 11.436L20.0281 9.46802L19.3081 8.74802L16.6681 11.388L15.5881 11.412Z"
        fill={color}
      />
    </svg>
  );
}

export default UnfreezeLight;
