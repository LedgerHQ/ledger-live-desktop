// @flow

import React, { useEffect } from "react";
import { animated, useTransition } from "react-spring";

type Props = {
  duration: number,
  onComplete?: () => void,
  nonce?: number,
};

export function TimeBasedProgressBar({ duration, onComplete, nonce = 1 }: Props) {
  const config = { duration, tension: 125, friction: 20, precision: 0.1 };
  const transitions = useTransition(1, null, {
    from: {
      width: "0%",
    },
    enter: {
      width: "100%",
    },
    config,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (nonce && onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [duration, onComplete, nonce]);

  return (
    <div
      style={{
        width: "100%",
        height: 5,
      }}
    >
      {transitions.map(({ key, props }) => (
        <animated.div
          key={key}
          style={{
            ...props,
            height: 5,
            width: "100%",
            transformOrigin: "left center",
            background: "#8a80db", // "#00000022",
          }}
        />
      ))}
    </div>
  );
}
