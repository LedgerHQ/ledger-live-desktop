// @flow
import React from "react";
import { Trans } from "react-i18next";
import IconReceive from "~/renderer/icons/Receive";
import IconSend from "~/renderer/icons/Send";
import IconSwap from "~/renderer/icons/Swap";
import IconExchange from "~/renderer/icons/Exchange";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import type { Props as ButtonProps } from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ToolTip from "~/renderer/components/Tooltip";
import styled from "styled-components";

const IconButton: ThemedComponent<ButtonProps> = styled(Button)`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  justify-content: center;
  padding: 0;
`;

type Props = {
  onClick: () => void,
  iconComponent: any,
  labelComponent: any,
  event?: string,
  eventProperties?: Object,
  disabled?: boolean,
};

export const ActionDefault = ({
  onClick,
  iconComponent,
  labelComponent,
  event,
  eventProperties,
  disabled,
}: Props) => (
  <ToolTip content={labelComponent}>
    <IconButton
      primary
      onClick={onClick}
      event={event}
      eventProperties={eventProperties}
      disabled={disabled}
    >
      <Box horizontal alignItems="center">
        {iconComponent}
      </Box>
    </IconButton>
  </ToolTip>
);

export const SendActionDefault = ({ onClick }: { onClick: () => void }) => (
  <ActionDefault
    onClick={onClick}
    iconComponent={<IconSend size={12} />}
    labelComponent={<Trans i18nKey="send.title" />}
  />
);

export const ReceiveActionDefault = ({ onClick }: { onClick: () => void }) => (
  <ActionDefault
    onClick={onClick}
    iconComponent={<IconReceive size={12} />}
    labelComponent={<Trans i18nKey="receive.title" />}
  />
);

export const SwapActionDefault = ({ onClick }: { onClick: () => void }) => {
  return (
    <ActionDefault
      onClick={onClick}
      iconComponent={<IconSwap size={12} />}
      labelComponent={<Trans i18nKey="sidebar.swap" />}
    />
  );
};

export const BuyActionDefault = ({ onClick }: { onClick: () => void }) => {
  return (
    <ActionDefault
      onClick={onClick}
      iconComponent={<IconExchange size={12} />}
      labelComponent={<Trans i18nKey="accounts.contextMenu.buy" />}
    />
  );
};
