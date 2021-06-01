// @flow
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { cryptoCurrenciesSelector } from "~/renderer/reducers/accounts";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Box from "~/renderer/components/Box";
import { SettingsSectionBody as Body, SettingsSectionRow as Row } from "../../SettingsSection";
import CurrencyRows from "./CurrencyRows";
import Track from "~/renderer/analytics/Track";

export default function Currencies() {
  const { t } = useTranslation();
  const currencies = useSelector(cryptoCurrenciesSelector);
  const [currency, setCurrency] = useState();

  const handleChangeCurrency = useCallback(
    (currency?: CryptoCurrency | TokenCurrency) => {
      if (!currency) return;
      setCurrency(currency);
    },
    [setCurrency],
  );

  const currencyId = currency?.id ?? "placeholder";
  const currencyName = currency?.name ?? "placeholder";

  return (
    <Box key={currencyId}>
      <TrackPage category="Settings" name="Currencies" currencyId={currencyId} />
      <Track onUpdate event="Crypto asset settings dropdown" currencyName={currencyName} />
      <Row
        title={t("settings.tabs.currencies")}
        desc={t("settings.currencies.desc")}
        style={{ cursor: "pointer" }}
      >
        <SelectCurrency
          small
          minWidth={200}
          value={currency}
          // $FlowFixMe Mayday we have a problem with <Select /> and its props
          onChange={handleChangeCurrency}
          currencies={currencies}
          placeholder={t("settings.currencies.selectPlaceholder")}
        />
      </Row>
      {currency && (
        <Body>
          <CurrencyRows currency={currency} />
        </Body>
      )}
    </Box>
  );
}
