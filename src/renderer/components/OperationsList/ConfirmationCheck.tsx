import React, { PureComponent } from "react";
import styled from "styled-components";

import { OperationType } from "@ledgerhq/live-common/lib/types";

import { rgba, mix } from "~/renderer/styles/helpers";

import { TFunction } from "react-i18next";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import Tooltip from "~/renderer/components/Tooltip";
import { Icons } from "@ledgerhq/react-ui";

const border = p =>
  p.hasFailed
    ? `1px solid ${p.theme.colors.alertRed}`
    : p.isConfirmed
    ? 0
    : `1px solid ${
        p.type === "IN" ? p.marketColor : rgba(p.theme.colors.palette.text.shade60, 0.2)
      }`;

function inferColor(p) {
  switch (p.type) {
    case "IN":
      return p.marketColor;
    case "FREEZE":
      return p.theme.colors.wallet;
    case "REWARD":
      return p.theme.colors.gold;
    default:
      return p.theme.colors.palette.text.shade60;
  }
}

export const Container: ThemedComponent<{
  isConfirmed: boolean;
  type: string;
  marketColor: string;
  hasFailed?: boolean;
}> = styled(Box).attrs(p => ({
  bg: p.hasFailed
    ? mix(p.theme.colors.palette.error.c100, p.theme.colors.palette.neutral.c00, 0.95)
    : p.isConfirmed
    ? mix(inferColor(p), p.theme.colors.palette.neutral.c00, 0.8)
    : p.theme.colors.palette.neutral.c00,
  color: p.hasFailed ? p.theme.colors.palette.error.c100 : inferColor(p),
  alignItems: "center",
  justifyContent: "center",
}))`
  border: ${border};
  border-radius: 50%;
  position: relative;
  height: 24px;
  width: 24px;
`;

const WrapperClock: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  color: "palette.text.shade60",
}))`
  border-radius: 50%;
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 1px;
`;

const iconsComponent = {
  OUT: Icons.ArrowFromBottomMedium,
  IN: Icons.ArrowToBottomMedium,
  DELEGATE: Icons.HandshakeMedium,
  REDELEGATE: Icons.DelegateMedium,
  UNDELEGATE: Icons.UndelegateMedium,
  REVEAL: Icons.EyeMedium,
  CREATE: Icons.PlusMedium,
  NONE: Icons.ArrowFromBottomMedium,
  FREEZE: Icons.FreezeMedium,
  UNFREEZE: Icons.UnfreezeMedium,
  VOTE: Icons.VoteMedium,
  REWARD: Icons.ClaimRewardsMedium,
  FEES: Icons.FeesMedium,
  OPT_IN: Icons.PlusMedium,
  OPT_OUT: Icons.TrashMedium,
  CLOSE_ACCOUNT: Icons.TrashMedium,
  REDEEM: Icons.MinusMedium,
  SUPPLY: Icons.ArrowRightMedium,
  APPROVE: Icons.PlusMedium,
  BOND: Icons.LinkMedium,
  UNBOND: Icons.LinkNoneMedium,
  WITHDRAW_UNBONDED: Icons.CoinsMedium,
  SLASH: Icons.TrashMedium,
  NOMINATE: Icons.VoteMedium,
  CHILL: Icons.VoteMedium,
  REWARD_PAYOUT: Icons.ClaimRewardsMedium,
  SET_CONTROLLER: Icons.ArrowFromBottomMedium,
};

class ConfirmationCheck extends PureComponent<{
  marketColor: string;
  isConfirmed: boolean;
  t: TFunction;
  type: OperationType;
  withTooltip?: boolean;
  hasFailed?: boolean;
}> {
  static defaultProps = {
    withTooltip: true,
  };

  renderTooltip = () => {
    const { t, isConfirmed } = this.props;
    return t(isConfirmed ? "operationDetails.confirmed" : "operationDetails.notConfirmed");
  };

  render() {
    const { marketColor, isConfirmed, t, type, withTooltip, hasFailed, ...props } = this.props;

    const Icon = iconsComponent[type];

    const content = (
      <Container
        {...props}
        type={type}
        isConfirmed={isConfirmed}
        marketColor={marketColor}
        hasFailed={hasFailed}
      >
        {Icon ? <Icon size={12} /> : null}
        {!isConfirmed && !hasFailed && (
          <WrapperClock>
            <Icons.ClockMedium size={10} />
          </WrapperClock>
        )}
      </Container>
    );

    return withTooltip ? (
      <Tooltip
        content={t(
          hasFailed
            ? "operationDetails.failed"
            : isConfirmed
            ? "operationDetails.confirmed"
            : "operationDetails.notConfirmed",
        )}
      >
        {content}
      </Tooltip>
    ) : (
      content
    );
  }
}

export default ConfirmationCheck;
