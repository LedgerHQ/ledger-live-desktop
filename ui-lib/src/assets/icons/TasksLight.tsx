import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TasksLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.26386 19.3201H5.18386V17.4001H3.26386V19.3201ZM2.25586 11.9041L4.24786 13.9201L7.24786 10.9201L6.52786 10.2001L4.24786 12.4801L2.97586 11.1841L2.25586 11.9041ZM2.25586 6.38405L4.24786 8.40005L7.24786 5.40005L6.52786 4.68005L4.24786 6.96005L2.97586 5.66405L2.25586 6.38405ZM7.58386 18.9601H21.7439V17.7601H7.58386V18.9601ZM8.78386 13.4401H21.7439V12.2401H8.78386V13.4401ZM8.78386 7.92005H21.7439V6.72005H8.78386V7.92005Z"
        fill={color}
      />
    </svg>
  );
}

export default TasksLight;
