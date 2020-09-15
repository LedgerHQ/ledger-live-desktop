// @flow

import React from "react";
import Lottie from "react-lottie";
import { getEnv } from "@ledgerhq/live-common/lib/env";

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
  <Lottie
    isClickToPauseDisabled
    ariaRole="animation"
    height={height}
    width={width}
    options={{
      loop,
      autoplay: getEnv("MOCK") ? false : autoplay,
      animationData: animation,
      rendererSettings,
    }}
  />
);

export default Animation;
