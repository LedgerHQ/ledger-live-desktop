// @flow
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { cryptoCurrenciesSelector } from "~/renderer/reducers/accounts";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Box from "~/renderer/components/Box";
import IconCurrencies from "~/renderer/icons/Currencies";
import IconAngleDown from "~/renderer/icons/AngleDown";
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from "../../SettingsSection";
import CurrencyRows from "./CurrencyRows";
import Track from "~/renderer/analytics/Track";

const Show = styled(Box)`
  transform: rotate(${p => (p.visible ? 180 : 0)}deg);
`;

const Currencies = () => {
  const { t } = useTranslation();
  const currencies = useSelector(cryptoCurrenciesSelector);
  const [currency, setCurrency] = useState(currencies[0]);
  const [sectionVisible, setSectionVisible] = useState(false);

  const handleChangeCurrency = useCallback(
    (currency: CryptoCurrency | TokenCurrency) => {
      setCurrency(currency);
    },
    [setCurrency],
  );

  const toggleCurrencySection = useCallback(() => {
    setSectionVisible(prevState => !prevState);
  }, [setSectionVisible]);

  return !currency ? null : (
    <Section key={currency.id}>
      <TrackPage category="Settings" name="Currencies" currencyId={currency.id} />
      <Track
        onUpdate
        event="Crypto asset settings dropdown"
        currencyName={currency.name}
        opened={sectionVisible}
      />
      <Header
        icon={<IconCurrencies size={16} />}
        title={t("settings.tabs.currencies")}
        desc={t("settings.currencies.desc")}
        renderRight={
          <Show visible={sectionVisible}>
            <IconAngleDown size={24} />
          </Show>
        }
        onClick={toggleCurrencySection}
        style={{ cursor: "pointer" }}
      />
      {sectionVisible && (
        <Body>
          <Row desc={t("settings.currencies.select")}>
            <SelectCurrency
              small
              minWidth={200}
              value={currency}
              // $FlowFixMe Mayday we have a problem with <Select /> and its props
              onChange={handleChangeCurrency}
              currencies={currencies}
            />
          </Row>
          <CurrencyRows currency={currency} />
        </Body>
      )}
    </Section>
  );
};

export default Currencies;
