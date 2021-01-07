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
  const [currency, setCurrency] = useState(() => {
    const btc = currencies.find(c => c.id === "bitcoin");
    return btc || currencies[0];
  });

  const handleChangeCurrency = useCallback(
    (currency: CryptoCurrency | TokenCurrency) => {
      setCurrency(currency);
    },
    [setCurrency],
  );

  return !currency ? null : (
    <Box key={currency.id}>
      <TrackPage category="Settings" name="Currencies" currencyId={currency.id} />
      <Track onUpdate event="Crypto asset settings dropdown" currencyName={currency.name} />
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
        />
      </Row>
      <Body>
        <CurrencyRows currency={currency} />
      </Body>
    </Box>
  );
}
