import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function TasksMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.12016 19.5361H5.52016V17.1361H3.12016V19.5361ZM2.16016 12.0721L4.34416 14.2801L7.53616 11.0881L6.43216 9.98411L4.34416 12.0721L3.26416 10.9681L2.16016 12.0721ZM2.16016 6.55211L4.34416 8.76011L7.53616 5.56811L6.43216 4.46411L4.34416 6.55211L3.26416 5.44811L2.16016 6.55211ZM7.92016 19.2961H21.8402V17.3761H7.92016V19.2961ZM8.88016 13.7761H21.8402V11.8561H8.88016V13.7761ZM8.88016 8.25611H21.8402V6.33611H8.88016V8.25611Z" fill={color} /></svg>;
}

export default TasksMedium;