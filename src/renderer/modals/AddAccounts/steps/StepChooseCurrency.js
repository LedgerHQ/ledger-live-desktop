// @flow

import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { listSupportedCurrencies, listTokens } from "@ledgerhq/live-common/lib/currencies";
import { findTokenAccountByCurrency } from "@ledgerhq/live-common/lib/account";
import { supportLinkByTokenType } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Button from "~/renderer/components/Button";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import Box from "~/renderer/components/Box";
import CurrencyBadge from "~/renderer/components/CurrencyBadge";
import TokenTips from "~/renderer/components/TokenTips";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import type { StepProps } from "..";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";

const StepChooseCurrency = ({ currency, setCurrency }: StepProps) => {
  const currencies = useMemo(() => listSupportedCurrencies().concat(listTokens()), []);
  return (
    <>
      {currency ? <CurrencyDownStatusAlert currency={currency} /> : null}
      {/* $FlowFixMe: onChange type is not good */}
      <SelectCurrency currencies={currencies} autoFocus onChange={setCurrency} value={currency} />
      {currency && currency.type === "TokenCurrency" ? (
        <TokenTips
          textKey="addAccounts.tokensTip"
          textData={{
            token: currency.name,
            ticker: currency.ticker,
            tokenType: currency.tokenType.toUpperCase(),
            currency: currency.parentCurrency.name,
          }}
        />
      ) : null}
    </>
  );
};

export const StepChooseCurrencyFooter = ({
  transitionTo,
  currency,
  existingAccounts,
  onCloseModal,
  setCurrency,
}: StepProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isToken = currency && currency.type === "TokenCurrency";

  // $FlowFixMe
  const url = isToken ? supportLinkByTokenType[currency.tokenType] : null;

  // $FlowFixMe
  const parentCurrency = isToken && currency.parentCurrency;

  // $FlowFixMe
  const accountData = isToken && findTokenAccountByCurrency(currency, existingAccounts);

  const parentTokenAccount = accountData ? accountData.parentAccount : null;

  const tokenAccount = accountData ? accountData.account : null;

  // specific cta in case of token accounts
  const onTokenCta = useCallback(() => {
    if (parentTokenAccount) {
      onCloseModal();
      dispatch(
        openModal(
          "MODAL_RECEIVE",
          tokenAccount // if already has token receive directly to it
            ? {
                account: tokenAccount,
                parentAccount: parentTokenAccount,
              }
            : {
                account: parentTokenAccount, // else receive to parent account
              },
        ),
      );
    } else if (parentCurrency) {
      // set parentCurrency in already opened add account flow and continue
      setCurrency(parentCurrency);
      transitionTo("connectDevice");
    }
  }, [
    parentTokenAccount,
    parentCurrency,
    onCloseModal,
    dispatch,
    setCurrency,
    tokenAccount,
    transitionTo,
  ]);

  return (
    <>
      <TrackPage category="AddAccounts" name="Step1" />
      {currency && <CurrencyBadge mr="auto" currency={currency} />}
      {isToken ? (
        <Box horizontal>
          {url ? (
            <ExternalLinkButton
              primary
              event="More info on Manage ERC20 tokens"
              url={url}
              label={t("common.learnMore")}
            />
          ) : null}

          {parentCurrency ? (
            <Button ml={2} primary onClick={onTokenCta} id="modal-token-continue-button">
              {parentTokenAccount
                ? t("addAccounts.cta.receive")
                : t("addAccounts.cta.addAccountName", {
                    currencyName: parentCurrency.name,
                  })}
            </Button>
          ) : null}
        </Box>
      ) : (
        <Button
          primary
          disabled={!currency}
          onClick={() => transitionTo("connectDevice")}
          id="modal-continue-button"
        >
          {t("common.continue")}
        </Button>
      )}
    </>
  );
};

export default StepChooseCurrency;
