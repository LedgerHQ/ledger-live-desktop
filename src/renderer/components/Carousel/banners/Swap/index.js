// @flow

import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Wrapper, Label, IllustrationWrapper } from "~/renderer/components/Carousel";

// Assets
import coin from "./images/coin1.png";
import coin2 from "./images/coin2.png";
import smallcoin1 from "./images/smallcoin1.png";
import smallcoin2 from "./images/smallcoin2.png";
import smallcoin3 from "./images/smallcoin3.png";
import loop from "./images/loop.png";
import bg from "./images/bg.png";

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
  const history = useHistory();

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
  const transBg = getTransform(5, 100, 65, 80);
  const transLoop = getTransform(-10, 40, 45, 40);
  const transCoin = getTransform(18, 30, 80, 30);
  const transCoin2 = getTransform(162, 30, 85, 30);
  const transSmallCoin1 = getTransform(157, 20, 100, 20);
  const transSmallCoin2 = getTransform(110, 20, 140, 20);
  const transSmallCoin3 = getTransform(90, 25, 85, 25);

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
    history.push({
      pathname: "/swap",
      state: { source: "swap banner" },
    });
  }, [history]);

  const ref = useRef(null);
  const scale = 0.7;
  return (
    <Wrapper ref={ref} onClick={onClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey={"banners.swap.title"} />
        </Label>
        <Text
          style={{ marginBottom: 16 }}
          ff="Inter|Medium"
          color="palette.text.shade50"
          fontSize={4}
        >
          <Trans i18nKey={"banners.swap.description"} />
        </Text>
      </Box>
      <IllustrationWrapper>
        <Layer style={transBg} image={bg} width={0.9 * 233} height={0.9 * 193} />
        <Layer style={transLoop} image={loop} width={scale * 374} height={scale * 199} />
        <Layer style={transCoin} image={coin} width={scale * 99} height={scale * 111} />
        <Layer style={transCoin2} image={coin2} width={scale * 103} height={scale * 109} />
        <Layer style={transSmallCoin1} image={smallcoin1} width={scale * 38} height={scale * 30} />
        <Layer style={transSmallCoin2} image={smallcoin2} width={scale * 10} height={scale * 11} />
        <Layer style={transSmallCoin3} image={smallcoin3} width={scale * 22} height={scale * 28} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default Swap;
