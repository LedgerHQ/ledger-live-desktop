// @flow

import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useHistory } from "react-router-dom";

// Assets
import cart from "./images/cart.png";
import coin from "./images/coin.png";
import coin2 from "./images/coin2.png";
import coin3 from "./images/coin3.png";
import bg from "./images/bg.png";

const IllustrationWrapper = styled.div`
  width: 257px;
  height: 100%;
  pointer-events: none;
  position: relative;
  right: 0;
  align-self: flex-end;
`;

const Wrapper: ThemedComponent<{}> = styled.div`
  width: 100%;
  height: 169px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
`;

const Label = styled(Text)`
  color: ${p => rgba(p.theme.colors.white, 0.5)};
  margin-bottom: 8px;
  max-width: 404px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

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
  const transBg = getTransform(-40, 100, 10, 80);
  const transCart = getTransform(40, 50, 15, 50);
  const transCoin = getTransform(136, 25, 76, 25);
  const transCoin2 = getTransform(150, 35, 42, 35);
  const transCoin3 = getTransform(105, 15, 50, 15);

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
    history.push("/exchange");
  }, [history]);

  const ref = useRef(null);

  return (
    <Wrapper ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey={"banners.buyCrypto.title"} />
        </Label>
        <Text style={{ marginBottom: 16 }} ff="Inter|Medium" color="white" fontSize={4}>
          <Trans i18nKey={"banners.buyCrypto.description"} />
        </Text>
        <Box horizontal>
          <Button primary onClick={onClick} alignItems={"center"}>
            <Box alignItems={"center"} horizontal>
              <Text>
                <Trans i18nKey={"banners.buyCrypto.cta"} />
              </Text>
            </Box>
          </Button>
        </Box>
      </Box>
      <IllustrationWrapper>
        <Layer style={transBg} image={bg} width={293} height={224} />
        <Layer style={transCart} image={cart} width={129} height={171} />
        <Layer style={transCoin} image={coin} width={31} height={26} />
        <Layer style={transCoin2} image={coin2} width={18} height={20} />
        <Layer style={transCoin3} image={coin3} width={37} height={30} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default BackupPack;
