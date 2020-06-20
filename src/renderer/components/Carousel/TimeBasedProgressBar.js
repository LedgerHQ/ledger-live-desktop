// @flow
import React, { useCallback, useMemo, useState, useEffect } from "react";
import Animated from "animated/lib/targets/react-dom";
import Easing from "animated/lib/Easing";
import { delay } from "@ledgerhq/live-common/lib/promise";
const easing = Easing.linear();

type Props = {
  duration: number,
  onComplete: () => void,
  paused?: boolean,
};

const TimeBasedProgressBar = ({ duration, onComplete, paused }: Props) => {
  const [nonce, setNonce] = useState(1);
  const [outOfFocusPaused, setOutOfFocusPaused] = useState(false);
  const progress = useMemo(() => {
    if (nonce || paused) {
      // NB we need this check.
      return new Animated.Value(0);
    }
  }, [nonce, paused]);

  const onWindowFocus = useCallback(() => {
    setOutOfFocusPaused(false);
    setNonce(nonce + 1);
  }, [nonce]);

  const onWindowBlur = useCallback(() => {
    setOutOfFocusPaused(true);
    setNonce(nonce + 1);
  }, [nonce]);

  useEffect(() => {
    window.addEventListener("focus", onWindowFocus);
    window.addEventListener("blur", onWindowBlur);
    return () => {
      window.removeEventListener("focus", onWindowFocus);
      window.removeEventListener("blur", onWindowBlur);
    };
  });

  useEffect(() => {
    let cancelled = false;
    if (paused) return;
    async function scheduleDelayedAnimation() {
      if (!paused && !cancelled) {
        if (cancelled) return;
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing,
        }).start();
        await delay(duration);

        if (cancelled || outOfFocusPaused) return;
        onComplete();
        setNonce(nonce + 1);
      }
    }
    if (!cancelled) {
      scheduleDelayedAnimation();
    }

    return () => {
      cancelled = true;
    };
  }, [duration, nonce, onComplete, outOfFocusPaused, paused, progress]);

  return (
    <div style={{ width: "100%", height: 5 }}>
      {paused || outOfFocusPaused ? null : (
        <Animated.div
          style={{
            height: 5,
            width: "100%",
            borderRadius: 4,
            transform: [{ scaleX: progress }],
            transformOrigin: "left center",
            background: "#FFFFFF33",
          }}
        />
      )}
    </div>
  );
};

export default TimeBasedProgressBar;
