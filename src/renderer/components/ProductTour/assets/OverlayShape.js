// @flow
import React, { useCallback, useState } from "react";
import type { OverlayConfig } from "~/renderer/components/ProductTour/Overlay";

/**
 * We are dynamically building an svg path based on two inner shapes:
 *  - a big square that will overflow but we don't care because it's bigger than the window
 *  - a fixed positioned rectangle that will make a hole on the shape to allow clicks and
 *    other mouse interactions.
 */
const OverlayShape = ({
  t,
  b,
  l,
  r,
  config,
}: {
  t: number,
  b: number,
  l: number,
  r: number,
  config: OverlayConfig,
}) => {
  const [pulse, setPulse] = useState(0);
  const { padding: p = 0, withFeedback } = config;
  const br = 5; // Rounded corner radius
  const w = r - l - br * 2 + p * 2;
  const h = b - t - br * 2 + p * 2;

  const onOverlayClick = useCallback(() => {
    setPulse(pulse + 1);
  }, [pulse]);

  if ([t, b, l, r, w, h].some(isNaN)) return null; // Too soon
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      width="100%"
      key={`overlay_${pulse}`}
      style={{ position: "absolute" }}
    >
      <path
        transform="scale(1 1)"
        transform-origin={`${l - p + w / 2} ${t - p + h / 2}`}
        onClick={withFeedback ? onOverlayClick : undefined}
        d={`M0 0h9999v9999H0V0z
            m ${l - p + br} ${t - p}
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
      >
        {pulse ? (
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1 1;1.1 1.2;1 1"
            begin="0s"
            dur="500ms"
            repeatCount="1"
          />
        ) : (
          <animate
            id="fadeIn"
            attributeType="xml"
            attributeName="fill-opacity"
            begin="0s"
            values="0;1"
            dur="400ms"
            repeatCount="1"
          />
        )}
      </path>
    </svg>
  );
};

export default OverlayShape;
