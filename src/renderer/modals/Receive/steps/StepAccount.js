// @flow

import React, { useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import type {
  Account,
  AccountLike,
  TokenCurrency,
  CryptoCurrency,
} from "@ledgerhq/live-common/lib/types";
import {
  getAccountCurrency,
  getMainAccount,
  getReceiveFlowError,
} from "@ledgerhq/live-common/lib/account";
import { listTokensForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Button from "~/renderer/components/Button";
import SelectAccount from "~/renderer/components/SelectAccount";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import type { StepProps } from "../Body";

type OnChangeAccount = (account: ?AccountLike, tokenAccount: ?Account) => void;

const AccountSelection = ({
  onChangeAccount,
  account,
}: {
  onChangeAccount: OnChangeAccount,
  account: ?AccountLike,
}) => (
  <>
    <Label>
      <Trans i18nKey="receive.steps.chooseAccount.label" />
    </Label>
    <SelectAccount autoFocus withSubAccounts onChange={onChangeAccount} value={account} />
  </>
);

const TokenParentSelection = ({
  onChangeAccount,
  mainAccount,
}: {
  onChangeAccount: OnChangeAccount,
  mainAccount: Account,
}) => {
  const filterAccountSelect = useCallback(a => getAccountCurrency(a) === mainAccount.currency, [
    mainAccount,
  ]);
  return (
    <>
      <Label>
        <Trans
          i18nKey="receive.steps.chooseAccount.parentAccount"
          values={{
            currencyName: mainAccount.currency.name,
          }}
        />
      </Label>
      <SelectAccount filter={filterAccountSelect} onChange={onChangeAccount} value={mainAccount} />
    </>
  );
};

const TokenSelection = ({
  currency,
  token,
  onChangeToken,
}: {
  currency: CryptoCurrency,
  token: ?TokenCurrency,
  onChangeToken: (token: ?TokenCurrency) => void,
}) => {
  const tokens = useMemo(() => listTokensForCryptoCurrency(currency), [currency]);
  return (
    <>
      <Label mt={30}>
        <Trans i18nKey="receive.steps.chooseAccount.token" />
      </Label>
      {/* I just don't know how to please you anymore Flow */}
      {/* $FlowFixMe */}
      <SelectCurrency onChange={onChangeToken} currencies={tokens} value={token} />
    </>
  );
};

export default function StepAccount({
  token,
  account,
  parentAccount,
  receiveTokenMode,
  onChangeAccount,
  onChangeToken,
}: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const error = account ? getReceiveFlowError(account, parentAccount) : null;

  return (
    <Box flow={1}>
      <TrackPage category="Receive Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      {receiveTokenMode && mainAccount ? (
        <TokenParentSelection mainAccount={mainAccount} onChangeAccount={onChangeAccount} />
      ) : (
        <AccountSelection account={account} onChangeAccount={onChangeAccount} />
      )}
      {receiveTokenMode && mainAccount ? (
        <TokenSelection
          currency={mainAccount.currency}
          token={token}
          onChangeToken={onChangeToken}
        />
      ) : null}
    </Box>
  );
}

export function StepAccountFooter({
  transitionTo,
  receiveTokenMode,
  token,
  account,
  parentAccount,
}: StepProps) {
  const error = account ? getReceiveFlowError(account, parentAccount) : null;
  return (
    <Button
      id={"receive-account-continue-button"}
      disabled={!account || (receiveTokenMode && !token) || !!error}
      primary
      onClick={() => transitionTo("device")}
    >
      <Trans i18nKey="common.continue" />
    </Button>
  );
}
