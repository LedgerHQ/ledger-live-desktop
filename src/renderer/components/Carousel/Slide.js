// @flow

import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Wrapper, Label, IllustrationWrapper } from "~/renderer/components/Carousel";
import { useHistory } from "react-router-dom";

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

type Img = {
  source: string,
  transform: [number, number, number, number],
  size: { width: number, height: number },
};
type Props = {
  url?: string,
  path?: string,
  title: *,
  description: *,
  imgs: Img[],
};

const Slide = ({ url, path, title, description, imgs }: Props) => {
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

  // React to the user mouse movement inside the banner for parallax effect
  const onMouseMove = e => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    set({ xy: [x - rect.width / 2, y - rect.height / 2] });
  };

  const onMouseLeave = () => set({ xy: [0, 0] });

  const onClick = useCallback(() => {
    if (path) {
      history.push({ pathname: path, state: { source: "banner" } });
      return;
    }
    if (url) {
      openURL(url);
    }
  }, [history, path, url]);

  // After initial slide-in animation, set the offset to zero
  useEffect(() => {
    setTimeout(_ => {
      set({ xy: [0, 0] });
    }, 400);
  }, [set]);

  const ref = useRef(null);
  return (
    <Wrapper onClick={onClick} ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          {title}
        </Label>
        <Text
          style={{ marginBottom: 16 }}
          ff="Inter|Medium"
          color="palette.text.shade50"
          fontSize={4}
        >
          {description}
        </Text>
      </Box>
      <IllustrationWrapper>
        {imgs.map(({ source, transform, size }, i) => (
          <Layer
            key={i}
            style={getTransform.apply(null, transform)}
            image={source}
            width={size.width}
            height={size.height}
          />
        ))}
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default Slide;
