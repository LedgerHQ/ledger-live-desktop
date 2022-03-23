import React, { useCallback, useEffect, useMemo } from "react";
import { Flex, Text, Icon } from "@ledgerhq/react-ui";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { starredMarketCoinsSelector, localeSelector } from "~/renderer/reducers/settings";
import {
  useSingleCoinMarketData,
  useMarketData,
} from "@ledgerhq/live-common/lib/market/MarketDataProvider";
import styled, { useTheme } from "styled-components";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { addStarredMarketCoins, removeStarredMarketCoins } from "~/renderer/actions/settings";
import { Button } from "..";
import MarketCoinChart from "./MarketCoinChart";
import MarketInfo from "./MarketInfo";
import { useProviders } from "../../exchange/Swap2/Form";
import Track from "~/renderer/analytics/Track";
import { getAvailableAccountsById } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { openModal } from "~/renderer/actions/modals";
import { getAllSupportedCryptoCurrencyTickers } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import { flattenAccounts } from "@ledgerhq/live-common/lib/account";

const CryptoCurrencyIconWrapper = styled.div`
  height: 56px;
  width: 56px;
  position: relative;
  border-radius: 56px;
  overflow: hidden;
  img {
    object-fit: cover;
  }
`;

const Container = styled(Flex).attrs({
  flex: "1",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
})``;

const StarContainer = styled(Flex).attrs({
  ml: 3,
  pb: 1,
})`
  cursor: pointer;
`;

const Title = styled(Text).attrs({ variant: "h3" })`
  font-size: 28px;
  line-height: 33px;
`;

export default function MarketCoinScreen() {
  const { refresh, selectCurrency } = useMarketData();
  const { t } = useTranslation();
  const history = useHistory();
  const { currencyId } = useParams<{ currencyId: string }>();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const starredMarketCoins: string[] = useSelector(starredMarketCoinsSelector);
  const isStarred = starredMarketCoins.includes(currencyId);
  const locale = useSelector(localeSelector);
  const allAccounts = useSelector(accountsSelector);
  const flattenedAccounts = flattenAccounts(allAccounts);
  const { providers, storedProviders } = useProviders();
  const swapAvailableIds = useMemo(() => {
    return providers || storedProviders
      ? (providers || storedProviders)
          .map(({ pairs }) => pairs.map(({ from, to }) => [from, to]))
          .flat(2)
      : [];
  }, [providers, storedProviders]);

  const {
    selectedCoinData: currency,
    chartRequestParams,
    loading,
    loadingChart,
    refreshChart,
    counterCurrency,
    setCounterCurrency,
    supportedCounterCurrencies,
  } = useSingleCoinMarketData(currencyId);

  const rampCatalog = useRampCatalog();

  const {
    id,
    ticker,
    name,
    image,
    marketcap,
    marketcapRank,
    totalVolume,
    high24h,
    low24h,
    marketCapChangePercentage24h,
    circulatingSupply,
    totalSupply,
    maxSupply,
    ath,
    athDate,
    atl,
    atlDate,
    price,
    priceChangePercentage,
    internalCurrency,
    chartData,
  } = currency || {};

  const [onRampAvailableTickers] = useMemo(() => {
    if (!rampCatalog.value) {
      return [[], []];
    }
    return [getAllSupportedCryptoCurrencyTickers(rampCatalog.value.onRamp)];
  }, [rampCatalog.value]);

  const availableOnBuy =
    currency && currency.ticker && onRampAvailableTickers.includes(currency.ticker.toUpperCase());
  const availableOnSwap = internalCurrency && swapAvailableIds.includes(internalCurrency.id);

  useEffect(() => {
    return () => {
      // @ts-expect-error can be an input
      selectCurrency(undefined);
      refresh({});
    };
  }, [selectCurrency, refresh]);

  const color = internalCurrency
    ? getCurrencyColor(internalCurrency, colors.background.main)
    : colors.primary.c80;

  const onBuy = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setTrackingSource("Page Market Coin");
      history.push({
        pathname: "/exchange",
        state: {
          mode: "onRamp",
          defaultTicker: currency && currency.ticker ? currency.ticker.toUpperCase() : undefined,
        },
      });
    },
    [internalCurrency, history, currency],
  );

  const openAddAccounts = useCallback(() => {
    if (currency)
      dispatch(
        openModal("MODAL_ADD_ACCOUNTS", {
          currency: currency.internalCurrency,
          preventSkippingCurrencySelection: true,
        }),
      );
  }, [dispatch, currency]);

  const onSwap = useCallback(
    e => {
      if (currency?.internalCurrency?.id) {
        e.preventDefault();
        e.stopPropagation();
        setTrackingSource("Page Market");

        const currencyId = currency?.internalCurrency?.id;

        const defaultAccount = getAvailableAccountsById(currencyId, flattenedAccounts).find(
          Boolean,
        );

        if (!defaultAccount) return openAddAccounts();

        history.push({
          pathname: "/swap",
          state: {
            defaultCurrency: currency.internalCurrency,
            defaultAccount,
            defaultParentAccount: defaultAccount?.parentId
              ? flattenedAccounts.find(a => a.id === defaultAccount.parentId)
              : null,
          },
        });
      }
    },
    [currency?.internalCurrency, flattenedAccounts, history, openAddAccounts],
  );

  const toggleStar = useCallback(() => {
    if (isStarred) {
      dispatch(removeStarredMarketCoins(id));
    } else {
      dispatch(addStarredMarketCoins(id));
    }
  }, [dispatch, isStarred, id]);

  return currency && counterCurrency ? (
    <Container>
      <Track
        event="Page Market Coin"
        onMount
        onUpdate
        currencyName={name}
        starred={isStarred}
        timeframe={chartRequestParams.range}
        countervalue={counterCurrency}
      />
      <Flex flexDirection="row" my={2} alignItems="center" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-start">
          <CryptoCurrencyIconWrapper>
            {internalCurrency ? (
              <CryptoCurrencyIcon
                currency={internalCurrency}
                size={56}
                circle
                fallback={<img width="56px" height="56px" src={image} alt={"currency logo"} />}
              />
            ) : (
              <img width="56px" height="56px" src={image} alt={"currency logo"} />
            )}
          </CryptoCurrencyIconWrapper>
          <Flex pl={3} flexDirection="column" alignItems="left" pr={16}>
            <Flex flexDirection="row" alignItems="center" justifyContent={"center"}>
              <Title>{name}</Title>
              <StarContainer data-test-id="market-coin-star-button" onClick={toggleStar}>
                <Icon name={isStarred > 0 ? "StarSolid" : "Star"} size={28} />
              </StarContainer>
            </Flex>
            <Text variant="small" color="neutral.c60">
              {ticker.toUpperCase()}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          {internalCurrency && (
            <>
              {availableOnBuy && (
                <Button
                  data-test-id="market-coin-buy-button"
                  variant="color"
                  mr={1}
                  onClick={onBuy}
                >
                  {t("accounts.contextMenu.buy")}
                </Button>
              )}
              {availableOnSwap && (
                <Button data-test-id="market-coin-swap-button" variant="color" onClick={onSwap}>
                  {t("accounts.contextMenu.swap")}
                </Button>
              )}
            </>
          )}
        </Flex>
      </Flex>
      <MarketCoinChart
        price={price}
        priceChangePercentage={priceChangePercentage}
        chartData={chartData}
        chartRequestParams={chartRequestParams}
        refreshChart={refreshChart}
        color={color}
        t={t}
        locale={locale}
        loading={loadingChart}
        setCounterCurrency={setCounterCurrency}
        supportedCounterCurrencies={supportedCounterCurrencies}
      />
      <MarketInfo
        marketcap={marketcap}
        marketcapRank={marketcapRank}
        totalVolume={totalVolume}
        high24h={high24h}
        low24h={low24h}
        price={price}
        priceChangePercentage={priceChangePercentage}
        marketCapChangePercentage24h={marketCapChangePercentage24h}
        circulatingSupply={circulatingSupply}
        totalSupply={totalSupply}
        maxSupply={maxSupply}
        ath={ath}
        athDate={athDate}
        atl={atl}
        atlDate={atlDate}
        locale={locale}
        counterCurrency={counterCurrency}
        loading={loading}
      />
    </Container>
  ) : null;
}
