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
  isStopped = false,
}: {
  animation: Object,
  width?: string,
  height?: string,
  loop?: boolean,
  autoplay?: boolean,
  rendererSettings?: *,
  isStopped?: boolean,
}) => (
  <Lottie
    isClickToPauseDisabled
    ariaRole="animation"
    height={height}
    width={width}
    isPaused={!!process.env.PLAYWRIGHT_RUN}
    isStopped={isStopped || !!process.env.PLAYWRIGHT_RUN}
    options={{
      loop: process.env.PLAYWRIGHT_RUN ? false : loop,
      autoplay: process.env.PLAYWRIGHT_RUN ? false : autoplay,
      animationData: animation,
      rendererSettings,
    }}
  />
);

export default Animation;
