import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function UnlockThin({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.02416 21.12H21.8402V9.60001H12.0962V7.848C12.0962 5.136 9.86416 2.88 7.12816 2.88C4.39216 2.88 2.16016 5.136 2.16016 7.848V11.16H2.64016V7.848C2.64016 5.4 4.65616 3.36 7.12816 3.36C9.60016 3.36 11.6162 5.4 11.6162 7.848V9.60001H9.02416V21.12ZM9.50416 20.64V10.08H21.3602V20.64H9.50416ZM15.1922 17.28H15.6722V13.2H15.1922V17.28Z" fill={color} /></svg>;
}

export default UnlockThin;