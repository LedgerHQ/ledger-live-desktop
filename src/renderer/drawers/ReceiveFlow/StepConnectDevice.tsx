import React from "react";
import { Trans } from "react-i18next";
import { Box, Flex, Divider, Text } from "@ledgerhq/react-ui";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { Account, AccountLike, TokenCurrency } from "@ledgerhq/live-common/lib/types";

import TrackPage from "~/renderer/analytics/TrackPage";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import DeviceAction from "~/renderer/components/DeviceAction";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import Button from "~/renderer/components/Button";

const connectAppExec = command("connectApp");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

type Props = {
  account?: AccountLike;
  parentAccount?: Account;
  token?: TokenCurrency;
  onResult: () => void;
};

export function StepConnectDevice({ account, parentAccount, token, onResult }: Props) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const tokenCurrency = (account && account.type === "TokenAccount" && account.token) || token;

  return (
    <>
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      <DeviceAction
        action={action}
        request={{ account: mainAccount, tokenCurrency }}
        onResult={onResult}
        analyticsPropertyFlow="receive"
      />
    </>
  );
}

type FooterProps = {
  onSkipConfirm: () => void;
  currencyName?: string;
  eventType?: string;
};

export function StepConnectDeviceFooter({ onSkipConfirm, eventType, currencyName }: FooterProps) {
  return (
    <Box m={-12}>
      <TrackPage
        category={`Receive Flow${eventType ? ` (${eventType})` : ""}`}
        name="Step 2"
        currencyName={currencyName || ""}
      />
      <Divider variant="light" />
      <Flex py={6} px={12} justifyContent="center">
        <Button
          event="Receive Flow Without Device Clicked"
          data-id={"receive-connect-device-skip-device-button"}
          onClick={onSkipConfirm}
        >
          <Text color="primary.c90">
            <Trans i18nKey="receive.steps.connectDevice.withoutDevice" />
          </Text>
        </Button>
      </Flex>
    </Box>
  );
}
