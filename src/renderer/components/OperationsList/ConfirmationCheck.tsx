import React, { PureComponent } from "react";
import { Icons, Tooltip, BoxedIcon } from "@ledgerhq/react-ui";
import { OperationType } from "@ledgerhq/live-common/lib/types";
import { TFunction } from "react-i18next";

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
  NFT_IN: undefined, // TODO: get icon from designers
  NFT_OUT: undefined, // TODO: get icon from designers
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
    const { isConfirmed, t, type, withTooltip, hasFailed } = this.props;

    const Icon = iconsComponent[type] || iconsComponent.NONE;

    const BadgeIcon = hasFailed
      ? Icons.CircledCrossSolidMedium
      : isConfirmed
      ? undefined
      : Icons.ClockSolidMedium;

    const borderColor = hasFailed ? "error.c40" : "neutral.c40";
    const iconColor = hasFailed ? "error.c100" : isConfirmed ? "neutral.c100" : "neutral.c50";
    const badgeColor = hasFailed ? "error.c100" : "neutral.c70";

    const content = (
      <BoxedIcon
        Icon={Icon}
        Badge={BadgeIcon}
        borderColor={borderColor}
        iconColor={iconColor}
        badgeColor={badgeColor}
      />
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
