import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function StarRegular({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.64018 21.816L12.0002 17.16L18.3602 21.816L15.9122 14.256L22.3202 9.55196H14.3762L12.0002 2.18396L9.62418 9.55196H1.68018L8.06418 14.256L5.64018 21.816ZM5.88018 10.92H10.6322L12.0002 6.67196L13.3682 10.92H18.1202L14.3042 13.728L15.7442 18.192L12.0002 15.456L8.25618 18.192L9.67218 13.728L5.88018 10.92Z" fill={color} /></svg>;
}

export default StarRegular;