// @flow
import React from "react";
import { Trans } from "react-i18next";
import IconReceive from "~/renderer/icons/Receive";
import IconSend from "~/renderer/icons/Send";
import IconSwap from "~/renderer/icons/Swap";
import IconExchange from "~/renderer/icons/Exchange";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

const ActionDefault = ({
  onClick,
  iconComponent,
  labelComponent,
}: {
  onClick: () => void,
  iconComponent: any,
  labelComponent: any,
}) => (
  <Button small primary onClick={onClick}>
    <Box horizontal flow={1} alignItems="center">
      {iconComponent}
      <Box>{labelComponent}</Box>
    </Box>
  </Button>
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
