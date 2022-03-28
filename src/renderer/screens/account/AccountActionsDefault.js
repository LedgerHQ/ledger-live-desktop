// @flow
import React from "react";
import { Trans } from "react-i18next";
import IconReceive from "~/renderer/icons/Receive";
import IconSend from "~/renderer/icons/Send";
import IconSwap from "~/renderer/icons/Swap";
import IconExchange from "~/renderer/icons/Exchange";
// $FlowFixMe
import Button from "~/renderer/components/Button.ui.tsx";
import { Flex } from "@ledgerhq/react-ui";
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
  <Button
    variant="color"
    onClick={onClick}
    event={event}
    eventProperties={eventProperties}
    disabled={disabled}
  >
    <Flex flexDirection="row" alignItems="center">
      {iconComponent ? <Flex mr="8px">{iconComponent}</Flex> : null} {labelComponent}
    </Flex>
  </Button>
);

export const SendActionDefault = ({ onClick }: { onClick: () => void }) => (
  <ActionDefault
    onClick={onClick}
    iconComponent={<IconSend size={14} />}
    labelComponent={<Trans i18nKey="send.title" />}
  />
);

export const ReceiveActionDefault = ({ onClick }: { onClick: () => void }) => (
  <ActionDefault
    onClick={onClick}
    iconComponent={<IconReceive size={14} />}
    labelComponent={<Trans i18nKey="receive.title" />}
  />
);

export const SwapActionDefault = ({ onClick }: { onClick: () => void }) => {
  return (
    <ActionDefault
      onClick={onClick}
      iconComponent={<IconSwap size={14} />}
      labelComponent={<Trans i18nKey="sidebar.swap" />}
    />
  );
};

export const BuyActionDefault = ({ onClick }: { onClick: () => void }) => {
  return (
    <ActionDefault
      onClick={onClick}
      iconComponent={<IconExchange size={14} />}
      labelComponent={<Trans i18nKey="accounts.contextMenu.buy" />}
    />
  );
};
