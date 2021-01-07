// @flow

import React, { useCallback, useEffect, useRef } from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { useSpring, animated } from "react-spring";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { useHistory } from "react-router-dom";
import { openModal } from "~/renderer/actions/modals";
import { Wrapper, Label, IllustrationWrapper } from "~/renderer/components/Carousel";

// Assets
import coin from "./images/coin.png";
import coin2 from "./images/coin2.png";
import coin3 from "./images/coin3.png";
import coin4 from "./images/coin4.png";
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

const StakeAlgorand = () => {
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
  const transBg = getTransform(-100, 50, 120, 50);
  const transCoin = getTransform(-40, 40, 90, 16);
  const transCoin2 = getTransform(130, 35, 90, 12);
  const transCoin3 = getTransform(90, 30, 55, 10);
  const transCoin4 = getTransform(140, 20, 40, 8);

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
    const currency = getCryptoCurrencyById("algorand");
    const highestBalanceAccount = accounts
      .filter(a => a.currency === currency && a.balance.gt(0))
      .sort((a, b) => b.balance.minus(a.balance));

    if (highestBalanceAccount[0]) {
      history.push({
        pathname: `/account/${highestBalanceAccount[0].id}`,
        state: { source: "stake algorand banner" },
      });
      dispatch(openModal("MODAL_ALGORAND_CLAIM_REWARDS", { account: highestBalanceAccount[0] }));
    } else {
      dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency }));
    }
  }, [accounts, dispatch, history]);

  const ref = useRef(null);
  return (
    <Wrapper ref={ref} onClick={onClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Box flex={1} p={24}>
        <Label ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey={"banners.stakeAlgorand.title"} />
        </Label>
        <Text
          style={{ marginBottom: 16 }}
          ff="Inter|Medium"
          color="palette.text.shade50"
          fontSize={4}
        >
          <Trans i18nKey={"banners.stakeAlgorand.description"} />
        </Text>
      </Box>
      <IllustrationWrapper>
        <Layer style={transBg} image={bg} width={300} height={230} />
        <Layer style={transCoin} image={coin} width={148} height={133} />
        <Layer style={transCoin2} image={coin2} width={49} height={56} />
        <Layer style={transCoin3} image={coin3} width={29} height={33} />
        <Layer style={transCoin4} image={coin4} width={25} height={20} />
      </IllustrationWrapper>
    </Wrapper>
  );
};

export default StakeAlgorand;
