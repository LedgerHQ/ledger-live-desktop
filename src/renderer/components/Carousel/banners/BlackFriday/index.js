// @flow

import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import Box from "~/renderer/components/Box";
import { openURL } from "~/renderer/linking";
import Text from "~/renderer/components/Text";
import { Wrapper, Label, IllustrationWrapper } from "~/renderer/components/Carousel";
import { urls } from "~/config/urls";

// Assets
import circle from "./images/circle.png";
import nanos from "./images/nanos.png";
import nanox from "./images/nanox.png";

const Layer = styled(animated.div)`
  background-image: url(${p => p.image});
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  will-change: transform;
  position: absolute;
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  transform-origin: top left;
`;

const BackupPack = () => {
  const [{ xy }, set] = useSpring(() => ({
    xy: [-120, -30],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  const getTransform = (offsetX, effectX, offsetY, effectY) => ({
    transform: xy.interpolate(
      (x, y) => `translate3d(${x / effectX + offsetX}px,${y / effectY + offsetY}px, 0)`,
    ),
  });

  // Generate the interpolator functions for each slide
  const transCircle = getTransform(85, 15, -5, 15);
  const transNanoS = getTransform(65, 40, 25, 40);
  const transNanoX = getTransform(40, 25, 35, 25);

  // React to the user mouse movement inside the banner for parallax effect
  const onMouseMove = e => {
    if (!ref.current) return;
    var rect = ref.current.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    set({ xy: [x - rect.width / 2, y - rect.height / 2] });
  };

  const onMouseLeave = () => set({ xy: [0, 0] });

  const onClick = useCallback(() => {
    openURL(urls.banners.blackfriday);
  }, []);

  // After initial slide-in animation, set the offset to zero
  useEffect(() => {
    setTimeout(_ => {
      set({ xy: [0, 0] });
    }, 400);
  }, [set]);

  const ref = useRef(null);
  const scale = 0.5;
  return (
    <Wrapper onClick={onClick} ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey={"banners.blackfriday.title"} />
        </Label>
        <Text
          style={{ marginBottom: 16 }}
          ff="Inter|Medium"
          color="palette.text.shade50"
          fontSize={4}
        >
          <Trans i18nKey={"banners.blackfriday.description"} />
        </Text>
      </Box>
      <IllustrationWrapper scale="1" translateY="0">
        <Layer style={transCircle} image={circle} width={scale * 214} height={scale * 242} />
        <Layer style={transNanoS} image={nanos} width={scale * 70} height={scale * 82} />
        <Layer style={transNanoX} image={nanox} width={scale * 120} height={scale * 152} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default BackupPack;
