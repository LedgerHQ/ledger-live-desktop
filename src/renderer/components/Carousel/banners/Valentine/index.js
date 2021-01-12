// @flow

import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Wrapper, Label, IllustrationWrapper } from "~/renderer/components/Carousel";

// Assets
import coins from "./images/coins.png";
import hearts from "./images/hearts.png";
import tag from "./images/tag.png";
import bg from "./images/BG.png";

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

const Swap = () => {
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
  const transBg = getTransform(0, 60, 5, 60);
  const transCoins = getTransform(45, 15, 5, 15);
  const transHearts = getTransform(25, 25, 5, 25);
  const transTag = getTransform(20, 40, 5, 40);

  // React to the user mouse movement inside the banner for parallax effect
  const onMouseMove = e => {
    if (!ref.current) return;
    var rect = ref.current.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    set({ xy: [x - rect.width / 2, y - rect.height / 2] });
  };

  const onMouseLeave = () => set({ xy: [0, 0] });

  // After initial slide-in animation, set the offset to zero
  useEffect(() => {
    setTimeout(_ => {
      set({ xy: [0, 0] });
    }, 400);
  }, [set]);

  const onClick = useCallback(() => {
    openURL(urls.banners.ledgerAcademy);
  }, []);

  const ref = useRef(null);
  const scale = 0.5;
  return (
    <Wrapper ref={ref} onClick={onClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey={"banners.valentine.title"} />
        </Label>
        <Text
          style={{ marginBottom: 16 }}
          ff="Inter|Medium"
          color="palette.text.shade50"
          fontSize={4}
        >
          <Trans i18nKey={"banners.valentine.description"} />
        </Text>
      </Box>
      <IllustrationWrapper scale="1" translateY="0">
        <Layer style={transBg} image={bg} width={scale * 284} height={scale * 244} />
        <Layer style={transTag} image={tag} width={scale * 214} height={scale * 199} />
        <Layer style={transHearts} image={hearts} width={scale * 181} height={scale * 164} />
        <Layer style={transCoins} image={coins} width={scale * 103} height={scale * 178} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default Swap;
