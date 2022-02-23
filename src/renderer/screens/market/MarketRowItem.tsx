import React, { useCallback, memo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { accountsSelector } from "~/renderer/reducers/accounts";
import styled, { useTheme } from "styled-components";
import { Flex, Text, Icon } from "@ledgerhq/react-ui";
import FormattedVal from "~/renderer/components/FormattedVal";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import counterValueFormatter from "@ledgerhq/live-common/lib/market/utils/countervalueFormatter";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { TableCell, TableRow } from "./MarketList";
import { SmallMarketItemChart } from "./MarketItemChart";
import { CurrencyData } from "@ledgerhq/live-common/lib/market/types";
import { Button } from ".";
import { useTranslation } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import { getAvailableAccountsById } from "@ledgerhq/live-common/lib/exchange/swap/utils";

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
  toggleStar: () => void;
  selectCurrency: (currencyId: string) => void;
  availableOnBuy: boolean;
  availableOnSwap: boolean;
  displayChart: boolean;
};

function MarketRowItem({
  style,
  currency,
  counterCurrency,
  locale,
  loading,
  isStarred,
  toggleStar,
  selectCurrency,
  availableOnBuy,
  availableOnSwap,
  displayChart,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openAddAccounts = useCallback(() => {
    if (currency)
      dispatch(
        openModal("MODAL_ADD_ACCOUNTS", {
          currency: currency.internalCurrency,
          preventSkippingCurrencySelection: true,
        }),
      );
  }, [dispatch, currency]);

  const history = useHistory();
  const { colors } = useTheme();
  const graphColor = colors.neutral.c80;
  const allAccounts = useSelector(accountsSelector);

  const onCurrencyClick = useCallback(() => {
    selectCurrency(currency.id);
    setTrackingSource("Page Market");
    history.push({
      pathname: `/market/${currency.id}`,
      state: currency,
    });
  }, [currency, history, selectCurrency]);

  const onBuy = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setTrackingSource("Page Market");
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
      if (currency?.internalCurrency?.id) {
        e.preventDefault();
        e.stopPropagation();
        setTrackingSource("Page Market");

        const defaultAccount = getAvailableAccountsById(
          currency?.internalCurrency?.id,
          allAccounts,
        ).find(Boolean);

        if (!defaultAccount) return openAddAccounts();

        history.push({
          pathname: "/swap",
          state: { defaultCurrency: currency.internalCurrency, defaultAccount },
        });
      }
    },
    [currency, allAccounts, history, openAddAccounts],
  );

  const onStarClick = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      toggleStar();
    },
    [toggleStar],
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
              <Flex flexDirection="column" alignItems="left" pr={2}>
                <Text variant="body">{currency.name}</Text>
                <Text variant="small" color="neutral.c60">
                  {currency.ticker.toUpperCase()}
                </Text>
              </Flex>
              {currency.internalCurrency && (
                <>
                  {availableOnBuy && (
                    <Button variant="shade" mr={1} onClick={onBuy}>
                      {t("accounts.contextMenu.buy")}
                    </Button>
                  )}
                  {availableOnSwap && (
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
              {counterValueFormatter({ value: currency.price, currency: counterCurrency, locale })}
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
                currency: counterCurrency,
                value: currency.marketcap,
                locale,
              })}
            </Text>
          </TableCell>
          {displayChart && (
            <TableCell>
              {currency.sparklineIn7d && (
                <SmallMarketItemChart sparklineIn7d={currency.sparklineIn7d} color={graphColor} />
              )}
            </TableCell>
          )}
          <TableCell onClick={onStarClick}>
            <Icon name={isStarred ? "StarSolid" : "Star"} size={18} />
          </TableCell>
        </TableRow>
      )}
    </div>
  );
}

export default memo<Props>(MarketRowItem);
