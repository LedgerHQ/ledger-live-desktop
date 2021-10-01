// @flow
import React, { useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleStarAction } from "~/renderer/actions/accounts";
import { isStarredAccountSelector } from "~/renderer/reducers/accounts";
import { rgba } from "~/renderer/styles/helpers";
import starAnim from "~/renderer/images/starAnim.png";
import starAnim2 from "~/renderer/images/starAnim2.png";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useRefreshAccountsOrdering } from "~/renderer/actions/general";
import { Transition } from "react-transition-group";
import { track } from "~/renderer/analytics/segment";
import { getKey, setKey } from "~/renderer/storage";
import type { CurrencyType } from "~/renderer/reducers/market";
import { updateFavoriteCryptocurrencies } from "~/renderer/actions/market";

const disableAnimation = process.env.SPECTRON_RUN;

type Props = {
  yellow?: boolean,
  currency?: CurrencyType,
  isStarred?: boolean,
  onClick?: any,
  disableAnimation?: boolean
};

export default function CryptocurrencyStar({
  yellow,
  currency = {},
  isStarred: propsIsStarred,
  onClick,
  disableAnimation,
}: Props) {
  const dispatch = useDispatch();
  const isStarred = propsIsStarred || !!currency.isStarred;
  const MaybeButtonWrapper = yellow ? ButtonWrapper : FloatingWrapper;
  const favorites = useSelector(state => state.market.favorites)

  const toggleStar = useCallback(
    e => {
      if (Object.keys(currency).length) {
        track(isStarred ? "Cryptocurrency Unstar" : "Cryptocurrency Star");
        e.stopPropagation();
        dispatch(
          updateFavoriteCryptocurrencies({
            cryptocurrencyId: currency.id,
            isStarred,
            favorites
          }),
        );
      } else {
        onClick(!isStarred);
      }
    },
    [currency, isStarred, dispatch, favorites, onClick],
  );

  return (
    <MaybeButtonWrapper filled={isStarred}>
      <StarWrapper id="cryptocurrency-star-button" onClick={toggleStar}>
        {disableAnimation ? (
          <StarIcon yellow={yellow} filled={isStarred} className={isStarred ? "entered" : ""} />
        ) : (
          <Transition in={isStarred} timeout={isStarred ? startBurstTiming : 0}>
            {className => (
              <StarIcon yellow={yellow} filled={isStarred} className={className} />
            )}
          </Transition>
        )}
      </StarWrapper>
    </MaybeButtonWrapper>
  );
}

const starBust = keyframes`
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
`;

const ButtonWrapper: ThemedComponent<{ filled?: boolean }> = styled.div`
  height: 34px;
  width: 34px;
  border: 1px solid
    ${p => (p.filled ? p.theme.colors.starYellow : p.theme.colors.palette.text.shade60)};
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  background: ${p => (p.filled ? p.theme.colors.starYellow : "transparent")};
  &:hover {
    background: ${p =>
  p.filled ? p.theme.colors.starYellow : rgba(p.theme.colors.palette.divider, 0.2)};
    border-color: ${p =>
  p.filled ? p.theme.colors.starYellow : p.theme.colors.palette.text.shade100};
  }
`;
const FloatingWrapper: ThemedComponent<{}> = styled.div``;

// NB negative margin to allow the burst to overflow
const StarWrapper: ThemedComponent<{}> = styled.div`
  margin: -17px;
`;

const startBurstTiming = 800;

const StarIcon: ThemedComponent<{
  filled?: boolean,
  yellow?: boolean,
}> = styled.div`
  &.entering {
    animation: ${starBust} ${startBurstTiming}ms steps(29) 1;
  }

  &.entered {
    background-position: right;
  }

  height: 50px;
  width: 50px;
  background-image: url("${p => (p.yellow ? starAnim2 : starAnim)}");
  background-repeat: no-repeat;
  background-size: 3000%;
  filter: brightness(1);
  transition: filter .1s ease-out;
  &:hover {
    filter: ${p =>
  p.theme.colors.palette.type === "dark" ? "brightness(1.3)" : "brightness(0.8)"};
  }
`;
