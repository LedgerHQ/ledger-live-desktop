// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";

import type { OperationType } from "@ledgerhq/live-common/lib/types";

import { rgba } from "~/renderer/styles/helpers";

import type { TFunction } from "react-i18next";

import IconClock from "~/renderer/icons/Clock";
import IconReceive from "~/renderer/icons/Receive";
import IconDelegate from "~/renderer/icons/Delegate";
import IconUndelegate from "~/renderer/icons/Undelegate";
import IconSend from "~/renderer/icons/Send";
import IconPlus from "~/renderer/icons/Plus";
import IconEye from "~/renderer/icons/Eye";

import Box from "~/renderer/components/Box";
import Tooltip from "~/renderer/components/Tooltip";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const border = p =>
  p.hasFailed
    ? `1px solid ${p.theme.colors.alertRed}`
    : p.isConfirmed
    ? 0
    : `1px solid ${
        p.type === "IN" ? p.marketColor : rgba(p.theme.colors.palette.text.shade60, 0.2)
      }`;

const Container: ThemedComponent<{
  isConfirmed: boolean,
  type: string,
  marketColor: string,
  hasFailed?: boolean,
}> = styled(Box).attrs(p => ({
  bg: p.hasFailed
    ? rgba(p.theme.colors.alertRed, 0.05)
    : p.isConfirmed
    ? rgba(p.type === "IN" ? p.marketColor : p.theme.colors.palette.text.shade60, 0.2)
    : "none",
  color: p.hasFailed
    ? p.theme.colors.alertRed
    : p.type === "IN"
    ? p.marketColor
    : p.theme.colors.palette.text.shade60,
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
  OUT: IconSend,
  IN: IconReceive,
  DELEGATE: IconDelegate,
  UNDELEGATE: IconUndelegate,
  REVEAL: IconEye,
  CREATE: IconPlus,
  NONE: IconSend,
  // TODO
  FREEZE: IconSend,
  UNFREEZE: IconSend,
  VOTE: IconSend,
  REWARD: IconReceive,
};

class ConfirmationCheck extends PureComponent<{
  marketColor: string,
  isConfirmed: boolean,
  t: TFunction,
  type: OperationType,
  withTooltip?: boolean,
  hasFailed?: boolean,
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
            <IconClock size={10} />
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
