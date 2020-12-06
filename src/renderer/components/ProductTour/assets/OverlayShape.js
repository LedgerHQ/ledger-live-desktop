// @flow

import React from "react";

/**
 * We are dynamically building an svg path based on two inner shapes:
 *  - a big square that will overflow but we don't care because it's bigger than the window
 *  - a fixed positioned rectangle that will make a hole on the shape to allow clicks and
 *    other mouse interactions.
 */
const OverlayShape = ({ t, b, l, r }: { t: number, b: number, l: number, r: number }) => {
  const br = 5; // Rounded corner radius
  const w = r - l - br * 2;
  const h = b - t - br * 2;
  if ([t, b, l, r, w, h].some(isNaN)) return null; // Too soon
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      width="100%"
      style={{ position: "absolute" }}
    >
      <path
        d={`
      M 0 0
      h 9999
      v 9999
      H 0
      V 0
      z
      
      m ${l + br} ${t}
      h ${w}
      c 2.7614 0 5 2.2386 5 5
      v ${h}
      c 0 2.7614-2.2386 5 -5 5
      h -${w}
      c -2.7614 0 -5 -2.2386 -5 -5
      v -${h}
      c 0 -2.7614 2.2386 -5 5 -5
      z`}
        fill="#142533cc"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default OverlayShape;
