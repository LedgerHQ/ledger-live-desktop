import React from "react";
import { Trans } from "react-i18next";
import { Icons } from "@ledgerhq/react-ui";
import Button from "~/renderer/components/Button";

const ActionDefault = ({
  onClick,
  Icon,
  labelComponent,
}: {
  onClick: () => void;
  Icon: React.ComponentType;
  labelComponent: any;
}) => (
  <Button variant="main" onClick={onClick} Icon={Icon} iconPosition="left">
    {labelComponent}
  </Button>
);

export const SendActionDefault = ({ onClick }: { onClick: () => void }) => (
  <ActionDefault
    onClick={onClick}
    Icon={Icons.ArrowFromBottomMedium}
    labelComponent={<Trans i18nKey="send.title" />}
  />
);

export const ReceiveActionDefault = ({ onClick }: { onClick: () => void }) => (
  <ActionDefault
    onClick={onClick}
    Icon={Icons.ArrowToBottomMedium}
    labelComponent={<Trans i18nKey="receive.title" />}
  />
);

export const SwapActionDefault = ({ onClick }: { onClick: () => void }) => {
  return (
    <ActionDefault
      onClick={onClick}
      Icon={Icons.BuyCryptoAltMedium}
      labelComponent={<Trans i18nKey="sidebar.swap" />}
    />
  );
};

export const BuyActionDefault = ({ onClick }: { onClick: () => void }) => {
  return (
    <ActionDefault
      onClick={onClick}
      Icon={Icons.BuyCryptoAltMedium}
      labelComponent={<Trans i18nKey="accounts.contextMenu.buy" />}
    />
  );
};
