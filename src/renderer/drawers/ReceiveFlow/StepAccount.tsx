import React, { useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import { Text, Box, Flex, Alert, Link, Divider, Icons } from "@ledgerhq/react-ui";
import {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import {
  listTokensForCryptoCurrency,
  listTokenTypesForCryptoCurrency,
} from "@ledgerhq/cryptoassets";
import {
  getAccountCurrency,
  getMainAccount,
  getReceiveFlowError,
} from "@ledgerhq/live-common/lib/account";
import { supportLinkByTokenType } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectAccount from "~/renderer/components/SelectAccount";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import { openURL } from "~/renderer/linking";
import Button from "~/renderer/components/Button";

type Props = {
  token?: TokenCurrency;
  account?: AccountLike;
  parentAccount?: Account;
  receiveTokenMode?: boolean;
  onChangeAccount: OnChangeAccount;
  onChangeToken: (token?: TokenCurrency | CryptoCurrency) => void;
  eventType?: string;
};
type OnChangeAccount = (account?: AccountLike | null, tokenAccount?: Account | null) => void;

const AccountSelection = ({
  onChangeAccount,
  account,
}: {
  onChangeAccount: OnChangeAccount;
  account?: AccountLike;
}) => (
  <Flex flexDirection="column" rowGap={4}>
    <Text variant="subtitle">
      <Trans i18nKey="receive.steps.chooseAccount.label" />
    </Text>
    <SelectAccount autoFocus withSubAccounts onChange={onChangeAccount} value={account} />
  </Flex>
);

const TokenParentSelection = ({
  onChangeAccount,
  mainAccount,
}: {
  onChangeAccount: OnChangeAccount;
  mainAccount: Account;
}) => {
  const filterAccountSelect = useCallback(a => getAccountCurrency(a) === mainAccount.currency, [
    mainAccount,
  ]);
  return (
    <Flex flexDirection="column" rowGap={4}>
      <Text variant="subtitle">
        <Trans
          i18nKey="receive.steps.chooseAccount.parentAccount"
          values={{
            currencyName: mainAccount.currency.name,
          }}
        />
      </Text>
      <SelectAccount filter={filterAccountSelect} onChange={onChangeAccount} value={mainAccount} />
    </Flex>
  );
};

const TokenSelection = ({
  currency,
  token,
  onChangeToken,
}: {
  currency: CryptoCurrency;
  token?: TokenCurrency;
  onChangeToken: (token?: TokenCurrency | CryptoCurrency) => void;
}) => {
  const tokens = useMemo(() => listTokensForCryptoCurrency(currency), [currency]);
  return (
    <Flex flexDirection="column" rowGap={4}>
      <Text variant="subtitle">
        <Trans i18nKey="receive.steps.chooseAccount.token" />
      </Text>
      <SelectCurrency onChange={onChangeToken} currencies={tokens} value={token} />
    </Flex>
  );
};

export function StepAccount({
  token,
  account,
  parentAccount,
  receiveTokenMode,
  onChangeAccount,
  onChangeToken,
  eventType,
}: Props) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const error = account ? getReceiveFlowError(account, parentAccount) : null;
  const tokenTypes = (mainAccount
    ? listTokenTypesForCryptoCurrency(mainAccount.currency)
    : []) as (keyof typeof supportLinkByTokenType)[];

  // Nb in the context of LL-6449 (nft integration) simplified the wording for the warning.
  const tokenType =
    mainAccount?.currency.name === "Ethereum"
      ? mainAccount.currency.name
      : tokenTypes.map(tt => tt.toUpperCase()).join("/");

  const url = supportLinkByTokenType[tokenTypes[0]];

  return (
    <Flex flexDirection="column" rowGap={7}>
      <TrackPage category={`Receive Flow${eventType ? ` (${eventType})` : ""}`} name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
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
      {account && !receiveTokenMode && tokenTypes.length ? (
        <Box mt={3}>
          <Alert
            type="warning"
            renderContent={() => (
              <Flex flexDirection="column" alignItems="flex-start">
                <Text variant="paragraph" color="inherit">
                  <Trans
                    i18nKey={`receive.steps.chooseAccount.${
                      account.type === "TokenAccount" ? "verifyTokenType" : "warningTokenType"
                    }`}
                    values={
                      account.type === "TokenAccount"
                        ? {
                            token: account.token.name,
                            tokenType,
                            currency: mainAccount && mainAccount.currency.name,
                          }
                        : {
                            ticker: account.currency.ticker,
                            tokenType,
                            currency: account.currency.name,
                          }
                    }
                  />
                </Text>
                <Link color="inherit" onClick={() => openURL(url)}>
                  <Trans i18nKey="common.learnMore" />
                </Link>
              </Flex>
            )}
          />
        </Box>
      ) : null}
    </Flex>
  );
}

type FooterProps = {
  token?: TokenCurrency;
  account?: AccountLike;
  parentAccount?: Account;
  receiveTokenMode?: boolean;
  onContinue: () => void;
};

export function StepAccountFooter({
  token,
  account,
  parentAccount,
  onContinue,
  receiveTokenMode,
}: FooterProps) {
  const error = account ? getReceiveFlowError(account, parentAccount) : null;

  return (
    <Box m={-12}>
      <Divider variant="light" />
      <Flex py={6} px={12} justifyContent="flex-end">
        <Button
          data-id={"receive-account-continue-button"}
          variant="main"
          disabled={!account || (receiveTokenMode && !token) || !!error}
          onClick={onContinue}
          Icon={Icons.ArrowRightMedium}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Flex>
    </Box>
  );
}
