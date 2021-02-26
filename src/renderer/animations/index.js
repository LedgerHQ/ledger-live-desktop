// @flow

import React from "react";
import Lottie from "react-lottie";

const Animation = ({
  animation,
  width = "100%",
  height = "100%",
  loop = true,
  autoplay = true,
  rendererSettings = { preserveAspectRatio: "xMidYMin" },
}: {
  animation: Object,
  width?: string,
  height?: string,
  loop?: boolean,
  autoplay?: boolean,
  rendererSettings?: *,
}) => (
  <div style={{ opacity: process.env.SPECTRON_RUN ? 0 : 1 }}>
    <Lottie
      isClickToPauseDisabled
      ariaRole="animation"
      height={height}
      width={width}
      isPaused={!!process.env.SPECTRON_RUN}
      isStopped={!!process.env.SPECTRON_RUN}
      options={{
        loop: process.env.SPECTRON_RUN ? false : loop,
        autoplay: process.env.SPECTRON_RUN ? false : autoplay,
        animationData: animation,
        rendererSettings,
      }}
    />
  </div>
);

export default Animation;
