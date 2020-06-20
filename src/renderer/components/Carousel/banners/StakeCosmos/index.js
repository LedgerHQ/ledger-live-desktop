// @flow

import React, { useCallback, useEffect, useRef } from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { useHistory } from "react-router-dom";
import { openModal } from "~/renderer/actions/modals";

// Assets
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

const StakeCosmos = () => {
  const accounts = useSelector(accountsSelector);
  const history = useHistory();
  const dispatch = useDispatch();

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
  const transBg = getTransform(0, 100, 40, 80);
  const transCoin = getTransform(90, 40, 25, 40);
  const transCoin2 = getTransform(0, 10, 70, 8);
  const transCoin3 = getTransform(140, 20, 60, 20);

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
    const currency = getCryptoCurrencyById("cosmos");
    const highestBalanceAccount = accounts
      .filter(a => a.currency === currency && a.balance.gt(0))
      .sort((a, b) => b.balance.minus(a.balance));

    if (highestBalanceAccount[0]) {
      history.push(`/account/${highestBalanceAccount[0].id}`);
    } else {
      dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency }));
    }
  }, [accounts, dispatch, history]);

  const ref = useRef(null);
  return (
    <Wrapper ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey={"banners.stakeCosmos.title"} />
        </Label>
        <Text style={{ marginBottom: 16 }} ff="Inter|Medium" color="white" fontSize={4}>
          <Trans i18nKey={"banners.stakeCosmos.description"} />
        </Text>
        <Box horizontal>
          <Button primary onClick={onClick} alignItems={"center"}>
            <Box alignItems={"center"} horizontal>
              <Text style={{ marginRight: 8 }}>
                <Trans i18nKey={"banners.stakeCosmos.cta"} />
              </Text>
            </Box>
          </Button>
        </Box>
      </Box>
      <IllustrationWrapper>
        <Layer style={transBg} image={bg} width={233} height={193} />
        <Layer style={transCoin} image={coin} width={100} height={24} />
        <Layer style={transCoin2} image={coin2} width={122} height={125} />
        <Layer style={transCoin3} image={coin3} width={80} height={75} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default StakeCosmos;
