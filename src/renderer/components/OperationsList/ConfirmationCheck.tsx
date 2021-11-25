import React, { PureComponent } from "react";
import styled from "styled-components";
import { Icons, Flex, Tooltip } from "@ledgerhq/react-ui";
import { OperationType } from "@ledgerhq/live-common/lib/types";
import { TFunction } from "react-i18next";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

const getTopRightRectangleClippedPolygon = (boxSize: number, rectangleSize: number) => {
  // clipping path that hides {rectangleSize}px top right rectangle
  const diff = boxSize - rectangleSize;
  return `polygon(0 0, 0 0, 0 0, ${diff}px 0, ${diff}px ${rectangleSize}px, 100% ${rectangleSize}px, 100% 100%, 100% 100%, 100% 100%, 0 100%, 0 100%, 0 100%)`;
};

const IconBox: ThemedComponent<{ size?: number; hasFailed?: boolean }> = styled(Flex)`
  height: ${p => p.size || 40}px;
  width: ${p => p.size || 40}px;
  border: 1px solid ${p => p.theme.colors.palette[p.hasFailed ? "error" : "neutral"].c40};
  ${p => {
    const size = p.size || 40;
    return p.withBadge && `clip-path: ${getTopRightRectangleClippedPolygon(size, 15)};`;
  }}
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const BadgeContainer: ThemedComponent<{ iconSize: number }> = styled.div`
  position: absolute;
  ${p => `
    top: -${p.iconSize / 2 - 2}px;
    right: -${p.iconSize / 2 - 2}px;`}
`;

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

const iconsComponent = {
  OUT: Icons.ArrowTopMedium,
  IN: Icons.ArrowBottomMedium,
  DELEGATE: Icons.HandshakeMedium,
  REDELEGATE: Icons.DelegateMedium,
  UNDELEGATE: Icons.UndelegateMedium,
  REVEAL: Icons.EyeMedium,
  CREATE: Icons.PlusMedium,
  NONE: Icons.ArrowFromBottomMedium,
  FREEZE: Icons.FreezeMedium,
  UNFREEZE: Icons.UnfreezeMedium,
  VOTE: Icons.VoteMedium,
  REWARD: Icons.StarMedium,
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

    const withBadge = !isConfirmed || hasFailed;
    const BadgeIcon = hasFailed ? Icons.CircledCrossSolidMedium : Icons.ClockSolidMedium;

    const content = (
      <div style={{ position: "relative" }}>
        <IconBox hasFailed={hasFailed} withBadge={withBadge}>
          {Icon ? (
            <Icon
              color={
                hasFailed
                  ? "palette.error.c100"
                  : isConfirmed
                  ? "palette.neutral.c100"
                  : "palette.neutral.c50"
              }
            />
          ) : null}
        </IconBox>
        {withBadge && (
          <BadgeContainer iconSize={20}>
            <BadgeIcon size={20} color={hasFailed ? "palette.error.c100" : "palette.neutral.c70"} />
          </BadgeContainer>
        )}
      </div>
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
