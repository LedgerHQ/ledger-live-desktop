// @flow

import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import { rgba } from "~/renderer/styles/helpers";
import IconExternalLink from "~/renderer/icons/ExternalLink";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { urls } from "~/config/urls";

// Assets
import hat from "./images/hat.png";
import nano from "./images/nano.png";
import coin from "./images/coin.png";
import card from "./images/card.png";
import coin2 from "./images/coin2.png";
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

const LedgerAcademy = () => {
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
  const transBg = getTransform(-100, 100, 20, 80);
  const transNano = getTransform(140, 15, -25, 15);
  const transCard = getTransform(80, 25, 80, 25);
  const transCoin = getTransform(50, 40, 140, 40);
  const transCoin2 = getTransform(0, 35, 120, 35);
  const transHat = getTransform(5, 8, 40, 8);

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
    openURL(urls.banners.ledgerAcademy);
  }, []);

  // After initial slide-in animation, set the offset to zero
  useEffect(() => {
    setTimeout(_ => {
      set({ xy: [0, 0] });
    }, 400);
  }, [set]);

  const ref = useRef(null);
  return (
    <Wrapper ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey={"banners.ledgerAcademy.title"} />
        </Label>
        <Text style={{ marginBottom: 16 }} ff="Inter|Medium" color="white" fontSize={4}>
          <Trans i18nKey={"banners.ledgerAcademy.description"} />
        </Text>
        <Box horizontal>
          <Button primary onClick={onClick} alignItems={"center"}>
            <Box alignItems={"center"} horizontal>
              <Text style={{ marginRight: 8 }}>
                <Trans i18nKey={"banners.ledgerAcademy.cta"} />
              </Text>
              <IconExternalLink size={16} />
            </Box>
          </Button>
        </Box>
      </Box>
      <IllustrationWrapper>
        <Layer style={transBg} image={bg} width={400} height={200} />
        <Layer style={transNano} image={nano} width={27} height={150} />
        <Layer style={transCard} image={card} width={139} height={109} />
        <Layer style={transCoin2} image={coin2} width={26} height={32} />
        <Layer style={transCoin} image={coin} width={28} height={62} />
        <Layer style={transHat} image={hat} width={150} height={112} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default LedgerAcademy;
