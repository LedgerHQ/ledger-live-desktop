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
import sell1 from "./images/sell-01@2x.png";
import sell2 from "./images/sell-02@2x.png";
import sell3 from "./images/sell-03@2x.png";
import sell4 from "./images/sell-04@2x.png";
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
  const transBg = getTransform(0, 100, 30 + 40, 100);
  const transSell1 = getTransform(58, 40, 18 + 40, 40);
  const transSell2 = getTransform(100, 25, 15 + 40, 25);
  const transSell3 = getTransform(120, 30, 38 + 40, 30);
  const transSell4 = getTransform(125, 20, 25 + 40, 20);

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
      pathname: "/exchange",
      state: {
        tab: 1,
      },
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
          <Trans i18nKey={"banners.sell.title"} />
        </Label>
        <Text
          style={{ marginBottom: 16 }}
          ff="Inter|Medium"
          color="palette.text.shade50"
          fontSize={4}
        >
          <Trans i18nKey={"banners.sell.description"} />
        </Text>
      </Box>
      <IllustrationWrapper scale={1}>
        <Layer style={transBg} image={bg} width={scale * 457} height={scale * 401} />
        <Layer style={transSell1} image={sell1} width={scale * 233} height={scale * 228} />
        <Layer style={transSell2} image={sell2} width={scale * 26} height={scale * 32} />
        <Layer style={transSell3} image={sell3} width={scale * 75} height={scale * 61} />
        <Layer style={transSell4} image={sell4} width={scale * 12} height={scale * 18} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default BackupPack;
