import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { Currency, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { cryptoCurrenciesSelector } from "~/renderer/reducers/accounts";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import { SectionRow as Row } from "../../Rows";
import CurrencyRows from "./CurrencyRows";
import Track from "~/renderer/analytics/Track";
import { currencySettingsDefaults } from "~/renderer/reducers/settings";

import { Flex } from "@ledgerhq/react-ui";

export default function Currencies() {
  const { t } = useTranslation();
  const currencies = useSelector(cryptoCurrenciesSelector);
  const [currency, setCurrency] = useState<CryptoCurrency | TokenCurrency | typeof undefined>();

  const handleChangeCurrency = useCallback(
    (currency?: CryptoCurrency | TokenCurrency) => {
      setCurrency(currency);
    },
    [setCurrency],
  );

  const currencyId = currency?.id;
  const currencyName = currency?.name;

  const isCurrencyDisabled = useCallback(
    (currency: Currency) => !currencySettingsDefaults(currency).confirmationsNb,
    [],
  );

  return (
    <Flex flexDirection="column" rowGap={10}>
      {currencyId && currencyName && (
        <>
          <TrackPage category="Settings" name="Currencies" currencyId={currencyId} />
          <Track onUpdate event="Crypto asset settings dropdown" currencyName={currencyName} />
        </>
      )}
      <Row
        title={t("settings.tabs.currencies")}
        desc={t("settings.currencies.desc")}
      >
        <SelectCurrency
          width={210}
          minWidth={210}
          value={currency}
          onChange={handleChangeCurrency}
          currencies={currencies}
          placeholder={t("settings.currencies.selectPlaceholder")}
          isCurrencyDisabled={isCurrencyDisabled}
        />
      </Row>
      {currency && (
          <CurrencyRows currency={currency} />
      )}
    </Flex>
  );
}
