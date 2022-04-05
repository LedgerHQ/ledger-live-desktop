// @flow
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import type {
  Currency,
  CryptoCurrency,
  TokenCurrency,
  Unit,
} from "@ledgerhq/live-common/lib/types";
import type {
  ValueChange,
  BalanceHistoryWithCountervalue,
} from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { setCountervalueFirst } from "~/renderer/actions/settings";
import { BalanceTotal, BalanceDiff } from "~/renderer/components/BalanceInfos";
import Box, { Tabbable } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Price from "~/renderer/components/Price";
import PillsDaysCount from "~/renderer/components/PillsDaysCount";
import styled from "styled-components";
import Swap from "~/renderer/icons/Swap";

// $FlowFixMe
import Button from "~/renderer/components/Button.ui.tsx";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import { getAllSupportedCryptoCurrencyIds } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";
import { useProviders } from "../exchange/Swap2/Form";

type Props = {
  isAvailable: boolean,
  cryptoChange: ValueChange,
  countervalueChange: ValueChange,
  last: $ElementType<BalanceHistoryWithCountervalue, 0>,
  counterValue: Currency,
  countervalueFirst: boolean,
  currency: CryptoCurrency | TokenCurrency,
  unit: Unit,
};

export default function AssetBalanceSummaryHeader({
  counterValue,
  isAvailable,
  last,
  cryptoChange,
  countervalueChange,
  countervalueFirst,
  currency,

  unit,
}: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const cvUnit = counterValue.units[0];
  const data = useMemo(
    () => [
      { valueChange: cryptoChange, balance: last.value, unit },
      { valueChange: countervalueChange, balance: last.countervalue, unit: cvUnit },
    ],
    [countervalueChange, cryptoChange, cvUnit, last.countervalue, last.value, unit],
  );

  useEffect(() => {
    if (countervalueFirst) {
      data.reverse();
    }
  }, [countervalueFirst, data]);

  const primaryKey = data[0].unit.code;
  const secondaryKey = data[1].unit.code;

  const rampCatalog = useRampCatalog();
  // eslint-disable-next-line no-unused-vars
  const [availableOnBuy, availableOnSell] = useMemo(() => {
    if (!rampCatalog.value) {
      return [false, false];
    }

    const allBuyableCryptoCurrencyIds = getAllSupportedCryptoCurrencyIds(rampCatalog.value.onRamp);
    const allSellableCryptoCurrencyIds = getAllSupportedCryptoCurrencyIds(
      rampCatalog.value.offRamp,
    );
    return [
      allBuyableCryptoCurrencyIds.includes(currency.id),
      allSellableCryptoCurrencyIds.includes(currency.id),
    ];
  }, [rampCatalog.value, currency.id]);

  const { providers, storedProviders } = useProviders();

  const availableOnSwap =
    (providers || storedProviders) &&
    !!(providers || storedProviders).find(({ pairs }) => {
      return pairs && pairs.find(({ from, to }) => [from, to].includes(currency.id));
    });

  const onBuy = useCallback(() => {
    setTrackingSource("asset header actions");
    history.push({
      pathname: "/exchange",
      state: {
        mode: "onRamp",
        currencyId: currency.id,
      },
    });
  }, [currency, history]);

  const onSwap = useCallback(() => {
    setTrackingSource("asset header actions");
    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency,
      },
    });
  }, [currency, history]);

  return (
    <Box flow={5}>
      <Box horizontal>
        {isAvailable && (
          <SwapButton onClick={() => dispatch(setCountervalueFirst(!countervalueFirst))}>
            <Swap />
          </SwapButton>
        )}
        <BalanceTotal
          key={primaryKey}
          style={{
            cursor: isAvailable ? "pointer" : "",
            overflow: "hidden",
            flexShrink: 1,
          }}
          onClick={() => setCountervalueFirst(!countervalueFirst)}
          showCryptoEvenIfNotAvailable
          isAvailable={isAvailable}
          totalBalance={data[0].balance}
          unit={data[0].unit}
        >
          <Wrapper style={{ marginTop: 4 }}>
            <div style={{ width: "auto", marginRight: 20 }}>
              {typeof data[1].balance === "number" && (
                <FormattedVal
                  key={secondaryKey}
                  animateTicker
                  disableRounding
                  alwaysShowSign={false}
                  color="warmGrey"
                  unit={data[1].unit}
                  fontSize={6}
                  showCode
                  val={data[1].balance}
                />
              )}
            </div>
            <Price
              unit={unit}
              from={currency}
              withActivityCurrencyColor
              withEquality
              color="warmGrey"
              fontSize={6}
              iconSize={16}
            />
          </Wrapper>
        </BalanceTotal>
        {availableOnBuy && (
          <Button data-test-id="portfolio-buy-button" variant="color" mr={1} onClick={onBuy}>
            {t("accounts.contextMenu.buy")}
          </Button>
        )}

        {availableOnSwap && (
          <Button data-test-id="portfolio-swap-button" variant="color" onClick={onSwap}>
            {t("accounts.contextMenu.swap")}
          </Button>
        )}
      </Box>
      <Box
        key={primaryKey}
        horizontal
        alignItems="center"
        justifyContent={isAvailable ? "space-between" : "flex-end"}
        flow={7}
      >
        <BalanceDiff
          totalBalance={data[0].balance}
          valueChange={data[0].valueChange}
          unit={data[0].unit}
          isAvailable={isAvailable}
        />
        <PillsDaysCount />
      </Box>
    </Box>
  );
}

const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const SwapButton = styled(Tabbable).attrs(() => ({
  color: "palette.text.shade100",
  ff: "Inter",
  fontSize: 7,
}))`
  align-items: center;
  align-self: center;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  color: ${p => p.theme.colors.palette.divider};
  cursor: pointer;
  display: flex;
  height: 53px;
  justify-content: center;
  margin-right: 16px;
  width: 25px;

  &:hover {
    border-color: ${p => p.theme.colors.palette.text.shade100};
    color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    opacity: 0.5;
  }
`;
