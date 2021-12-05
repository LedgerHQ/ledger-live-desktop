import React, { useCallback, memo } from "react";
import { useHistory } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { Flex, Text, Icon } from "@ledgerhq/react-ui";
import FormattedVal from "~/renderer/components/FormattedVal";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import counterValueFormatter from "./utils/countervalueFormatter";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { TableCell, TableRow } from "./MarketList";
import { SmallMarketItemChart } from "./MarketItemChart";
import { CurrencyData } from "./types";
import { Button } from ".";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { useTranslation } from "react-i18next";

const CryptoCurrencyIconWrapper = styled.div`
  height: 32px;
  width: 32px;
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  img {
    object-fit: cover;
  }
`;

type Props = {
  currency: CurrencyData;
  counterCurrency: string;
  style: any;
  loading: boolean;
  locale: string;
  isStarred: boolean;
  hideSparkline: boolean;
  toggleStar: () => void;
  selectCurrency: (currencyId: string) => void;
};

const overflowStyles = { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" };

function MarketRowItem({
  style,
  currency,
  counterCurrency,
  locale,
  loading,
  isStarred,
  hideSparkline,
  toggleStar,
  selectCurrency,
}: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { colors } = useTheme();
  const color = currency?.internalCurrency
    ? getCurrencyColor(currency.internalCurrency, colors.background.main)
    : colors.primary.c80;

  const onCurrencyClick = useCallback(() => {
    selectCurrency(currency.id);
    setTrackingSource("accounts page");
    history.push({
      pathname: `/market/${currency.id}`,
      state: currency,
    });
  }, [currency, history]);

  const onBuy = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setTrackingSource("market page");
      history.push({
        pathname: "/exchange",
        state: {
          defaultCurrency: currency.internalCurrency,
        },
      });
    },
    [currency, history],
  );

  const onSwap = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setTrackingSource("market page");
      history.push({
        pathname: "/swap",
        state: {
          defaultCurrency: currency.internalCurrency,
        },
      });
    },
    [currency, history],
  );

  return (
    <div style={{ ...style }}>
      {loading || !currency ? (
        <TableRow disabled>
          <TableCell loading />
          <TableCell loading />
          <TableCell loading />
          <TableCell loading />
          <TableCell loading />
          <TableCell loading />
          <TableCell loading />
        </TableRow>
      ) : (
        <TableRow onClick={onCurrencyClick}>
          <TableCell>{currency?.marketcapRank ?? "-"}</TableCell>
          <TableCell>
            <CryptoCurrencyIconWrapper>
              {currency.internalCurrency ? (
                <CryptoCurrencyIcon
                  currency={currency.internalCurrency}
                  size={32}
                  circle
                  fallback={
                    <img width="32px" height="32px" src={currency.image} alt={"currency logo"} />
                  }
                />
              ) : (
                <img width="32px" height="32px" src={currency.image} alt={"currency logo"} />
              )}
            </CryptoCurrencyIconWrapper>
            <Flex pl={3} flexDirection="row" alignItems="center">
              <Flex flexDirection="column" alignItems="left" pr={16}>
                <Text variant="body">{currency.name}</Text>
                <Text variant="small" color="neutral.c60">
                  {currency.ticker.toUpperCase()}
                </Text>
              </Flex>
              {currency.internalCurrency && (
                <>
                  {isCurrencySupported("BUY", currency.internalCurrency) && (
                    <Button variant="shade" mr={20} onClick={onBuy}>
                      {t("accounts.contextMenu.buy")}
                    </Button>
                  )}
                  {isCurrencySupported("SELL", currency.internalCurrency) && (
                    <Button variant="shade" onClick={onSwap}>
                      {t("accounts.contextMenu.swap")}
                    </Button>
                  )}
                </>
              )}
            </Flex>
          </TableCell>
          <TableCell>
            <Text variant="body">
              {counterValueFormatter({ value: currency.price, counterCurrency, locale })}
            </Text>
          </TableCell>
          <TableCell>
            {currency.priceChangePercentage && (
              <FormattedVal
                isPercent
                isNegative
                val={parseFloat(currency.priceChangePercentage.toFixed(2))}
                inline
                withIcon
              />
            )}
          </TableCell>
          <TableCell>
            <Text>
              {counterValueFormatter({
                shorten: true,
                counterCurrency,
                value: currency.marketcap,
                locale,
              })}
            </Text>
          </TableCell>
          <TableCell>
            {currency.sparklineIn7d && !hideSparkline && (
              <SmallMarketItemChart sparklineIn7d={currency.sparklineIn7d} color={color} />
            )}
          </TableCell>
          <TableCell onClick={toggleStar}>
            <Icon name={isStarred ? "StarSolid" : "Star"} size={18} />
          </TableCell>
        </TableRow>
      )}
    </div>
  );
}

export default memo<Props>(MarketRowItem);
