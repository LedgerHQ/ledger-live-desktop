// @flow

import React, { memo, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { listSupportedCurrencies, listTokens } from "@ledgerhq/live-common/lib/currencies";
import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { supportLinkByTokenType } from "~/config/urls";
import { colors } from "~/renderer/styles/theme";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Button from "~/renderer/components/Button";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import CurrencyBadge from "~/renderer/components/CurrencyBadge";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import InfoCircle from "~/renderer/icons/InfoCircle";
import type { StepProps } from "..";

const TokenTipsContainer = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  font-weight: 400;
  padding: 16px;
`;

const TokenTips = memo(function TokenTips({ currency }: { currency: TokenCurrency }) {
  const { t } = useTranslation();
  return (
    <TokenTipsContainer mt={4} horizontal alignItems="center">
      <InfoCircle size={16} color={colors.wallet} />
      <Text style={{ flex: 1, marginLeft: 20 }} ff="Inter|Regular" fontSize={4}>
        {t("addAccounts.tokensTip", {
          token: currency.name,
          ticker: currency.ticker,
          tokenType: currency.tokenType.toUpperCase(),
          currency: currency.parentCurrency.name,
        })}
      </Text>
    </TokenTipsContainer>
  );
});

const StepChooseCurrency = ({ currency, setCurrency }: StepProps) => {
  const currencies = useMemo(() => listSupportedCurrencies().concat(listTokens()), []);
  return (
    <>
      {currency ? <CurrencyDownStatusAlert currency={currency} /> : null}
      {/* $FlowFixMe: onChange type is not good */}
      <SelectCurrency currencies={currencies} autoFocus onChange={setCurrency} value={currency} />
      {currency && currency.type === "TokenCurrency" ? <TokenTips currency={currency} /> : null}
    </>
  );
};

export const StepChooseCurrencyFooter = ({ transitionTo, currency }: StepProps) => {
  const { t } = useTranslation();
  const url =
    currency && currency.type === "TokenCurrency"
      ? supportLinkByTokenType[currency.tokenType]
      : null;

  return (
    <>
      <TrackPage category="AddAccounts" name="Step1" />
      {currency && <CurrencyBadge mr="auto" currency={currency} />}
      {currency && currency.type === "TokenCurrency" ? (
        url ? (
          <ExternalLinkButton
            primary
            event="More info on Manage ERC20 tokens"
            url={url}
            label={t("common.learnMore")}
          />
        ) : null
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
