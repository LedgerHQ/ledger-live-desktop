import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ReverseUltraLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.18C16.92 21.18 21 17.1 21 12.18C21 7.26001 16.92 3.18001 12 3.18001C8.784 3.18001 5.952 4.98001 4.368 7.64401V5.19601V2.82001H3.6V8.96401H9.744V8.17201H7.368C6.552 8.17201 5.712 8.19601 4.944 8.19601C6.36 5.70001 9.024 4.02001 12 4.02001C16.464 4.02001 20.16 7.71601 20.16 12.18C20.16 16.644 16.464 20.34 12 20.34C7.536 20.34 3.84 16.644 3.84 12.18H3C3 17.1 7.08 21.18 12 21.18Z" fill={color} /></svg>;
}

export default ReverseUltraLight;