import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TasksUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.3362 19.212H5.0162V17.532H3.3362V19.212ZM2.3042 11.82L4.2002 13.74L7.1042 10.836L6.5762 10.308L4.2002 12.684L2.8322 11.292L2.3042 11.82ZM2.3042 6.29999L4.2002 8.21999L7.1042 5.31599L6.5762 4.78799L4.2002 7.16399L2.8322 5.77199L2.3042 6.29999ZM7.4162 18.78H21.6962V17.94H7.4162V18.78ZM8.7362 13.26H21.6962V12.42H8.7362V13.26ZM8.7362 7.73999H21.6962V6.89999H8.7362V7.73999Z"
        fill={color}
      />
    </svg>
  );
}

export default TasksUltraLight;
