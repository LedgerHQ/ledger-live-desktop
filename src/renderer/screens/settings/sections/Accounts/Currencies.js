// @flow
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { cryptoCurrenciesSelector } from "~/renderer/reducers/accounts";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Box from "~/renderer/components/Box";
import IconCurrencies from "~/renderer/icons/Currencies";
import {
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
} from "../../SettingsSection";
import CurrencyRows from "./CurrencyRows";
import Track from "~/renderer/analytics/Track";

export default function Currencies() {
  const { t } = useTranslation();
  const currencies = useSelector(cryptoCurrenciesSelector);
  const [currency, setCurrency] = useState(currencies[0]);

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
      <Header
        icon={<IconCurrencies size={16} />}
        title={t("settings.tabs.currencies")}
        desc={t("settings.currencies.desc")}
        style={{ cursor: "pointer" }}
        renderRight={
          <SelectCurrency
            small
            minWidth={200}
            value={currency}
            // $FlowFixMe Mayday we have a problem with <Select /> and its props
            onChange={handleChangeCurrency}
            currencies={currencies}
          />
        }
      />
      <Body>
        <CurrencyRows currency={currency} />
      </Body>
    </Box>
  );
}
