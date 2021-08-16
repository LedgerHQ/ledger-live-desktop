import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function DevicesMedium({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.4001 21.3599H12.0001V19.5599H5.5681C5.5441 19.5599 5.5201 19.5359 5.5201 19.5119V4.48789C5.5201 4.46389 5.5441 4.43989 5.5681 4.43989H15.6721C15.6961 4.43989 15.7201 4.46389 15.7201 4.48789V6.35989H17.6401V4.43989C17.6401 3.45589 16.8241 2.63989 15.8401 2.63989H5.4001C4.4161 2.63989 3.6001 3.45589 3.6001 4.43989V19.5599C3.6001 20.5439 4.4161 21.3599 5.4001 21.3599ZM14.0401 21.3599H20.4001V8.39989H14.0401V21.3599ZM15.8401 19.5599V10.1999H18.6001V19.5599H15.8401Z" fill={color} /></svg>;
}

export default DevicesMedium;