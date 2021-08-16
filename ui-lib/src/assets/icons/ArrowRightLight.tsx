import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ArrowRightLight({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7479 18.624L21.3719 12L14.7479 5.37598L13.9799 6.11998L17.2439 9.38398C17.9159 10.056 18.6119 10.752 19.3079 11.424H2.62793V12.576H19.3079C18.6119 13.248 17.9159 13.92 17.2439 14.592L13.9799 17.856L14.7479 18.624Z" fill={color} /></svg>;
}

export default ArrowRightLight;