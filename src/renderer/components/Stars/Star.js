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

const disableAnimation = process.env.PLAYWRIGHT_RUN;

type Props = {
  accountId: string,
  parentId?: string,
  yellow?: boolean,
  rounded?: boolean,
};

export default function Star({ accountId, parentId, yellow, rounded }: Props) {
  const isAccountStarred = useSelector(state => isStarredAccountSelector(state, { accountId }));
  const dispatch = useDispatch();
  const refreshAccountsOrdering = useRefreshAccountsOrdering();

  const toggleStar = useCallback(
    e => {
      track(isAccountStarred ? "Account Unstar" : "Account Star");
      e.stopPropagation();
      dispatch(toggleStarAction(accountId, parentId));
      refreshAccountsOrdering();
    },
    [isAccountStarred, dispatch, accountId, parentId, refreshAccountsOrdering],
  );
  const MaybeButtonWrapper = yellow ? ButtonWrapper : FloatingWrapper;

  return (
    <MaybeButtonWrapper filled={isAccountStarred} rounded={rounded}>
      <StarWrapper id="account-star-button" onClick={toggleStar} tabIndex="-1" rounded={rounded}>
        {disableAnimation ? (
          <StarIcon
            yellow={yellow}
            filled={isAccountStarred}
            className={isAccountStarred ? "entered" : ""}
          />
        ) : (
          <Transition in={isAccountStarred} timeout={isAccountStarred ? startBurstTiming : 0}>
            {className => (
              <StarIcon yellow={yellow} filled={isAccountStarred} className={className} />
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

const ButtonWrapper: ThemedComponent<{ filled?: boolean, rounded?: boolean }> = styled.div`
  height: ${p => (p.rounded ? 40 : 34)}px};
  width: ${p => (p.rounded ? 40 : 34)}px};
  border: 1px solid
    ${p => (p.filled ? p.theme.colors.starYellow : p.theme.colors.palette.text.shade60)};
  border-radius: ${p => (p.rounded ? 20 : 4)}px;
  padding: ${p => (p.rounded ? 14 : 8)}px;
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
const StarWrapper: ThemedComponent<{ rounded?: boolean }> = styled.div`
  margin: -${p => (p.rounded ? 20 : 17)}px;
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
