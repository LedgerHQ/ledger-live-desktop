// @flow

import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { useHistory } from "react-router-dom";
import { Wrapper, Label, IllustrationWrapper } from "~/renderer/components/Carousel";

// Assets
import img1 from "./images/1.png";
import img2 from "./images/2.png";
import img3 from "./images/3.png";
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

const BackupPack = () => {
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
  const transBg = getTransform(-20, 60, 15, 60);
  const transimg1 = getTransform(30, 15, 30, 15);
  const transimg2 = getTransform(115, 25, 40, 25);
  const transimg3 = getTransform(85, 40, -5, 40);

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
    history.push({
      pathname: "/lend",
    });
  }, [history]);

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
          <Trans i18nKey={"banners.lending.title"} />
        </Label>
        <Text
          style={{ marginBottom: 16 }}
          ff="Inter|Medium"
          color="palette.text.shade50"
          fontSize={4}
        >
          <Trans i18nKey={"banners.lending.description"} />
        </Text>
      </Box>
      <IllustrationWrapper scale="1" translateY="0">
        <Layer style={transBg} image={bg} width={scale * 432} height={scale * 356} />
        <Layer style={transimg1} image={img1} width={scale * 165} height={scale * 176} />
        <Layer style={transimg2} image={img2} width={scale * 104} height={scale * 112} />
        <Layer style={transimg3} image={img3} width={scale * 92} height={scale * 78} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default BackupPack;
