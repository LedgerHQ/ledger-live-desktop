// @flow
import React, { useCallback, memo } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import LoadingPlaceholder from "~/renderer/components/LoadingPlaceholder";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import { rgba } from "~/renderer/styles/helpers";
import CounterValueFormatter from "~/renderer/components/CounterValueFormatter";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { Cell, ItemRow } from ".";

const CryptoCurrencyIconWrapper: ThemedComponent<{}> = styled("div")`
  height: 20px;
  width: 20px;
  position: relative;

  img {
    height: 100%;
  }
`;

const CurrencyTicker: ThemedComponent<{}> = styled("div")`
  padding: 5px 10px;
  color: ${p => p.theme.colors.palette.text.shade30};
`;

const BuySwapBtn = styled(Button)`
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  border: none;
  height: unset;
  padding: 5px 8px;
`;

const Row: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 4px 8px 0 #00000007;
  color: #abadb6;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex: 1;
  font-weight: 600;
  justify-content: flex-end;
  position: relative;
  transition: background-color ease-in-out 200ms;

  :hover {
    background: ${p => rgba(p.theme.colors.palette.background.default, 0.6)};
  }

  :active {
    border-color: ${p => p.theme.colors.palette.text.shade20};
    background: ${p => p.theme.colors.palette.action.hover};
  }
`;

type Props = {
  currency: MarketCurrencyInfo,
  counterCurrency: string,
  style: any,
  loading: boolean,
};

const overflowStyles = { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" };

function MarketRowItem(props: Props) {
  const history = useHistory();
  const { style, currency, loading, counterCurrency } = props;

  const onCurrencyClick = useCallback(() => {
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
          defaultCurrency: currency.supportedCurrency,
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
          defaultCurrency: currency.supportedCurrency,
        },
      });
    },
    [currency, history],
  );

  return (
    <div style={{ ...style }} onClick={onCurrencyClick}>
      <Row expanded={true}>
        <ItemRow>
          <Cell>
            {loading ? (
              <LoadingPlaceholder style={{ width: "20px" }} />
            ) : (
              currency?.market_cap_rank ?? "-"
            )}
          </Cell>
          <Cell>
            <CryptoCurrencyIconWrapper>
              {loading ? (
                <LoadingPlaceholder />
              ) : (
                <img src={currency.image} alt={"currency logo"} />
              )}
            </CryptoCurrencyIconWrapper>
            <div style={{ ...overflowStyles, paddingLeft: 15, marginLeft: 4, width: "100%" }}>
              <Box horizontal alignItems="center">
                {loading ? (
                  <LoadingPlaceholder />
                ) : (
                  <>
                    <Box alignItems="left" pr={16}>
                      {currency.name}
                      <CurrencyTicker style={{ paddingLeft: 0, paddingBottom: 0, paddingTop: 0 }}>
                        {currency.symbol.toUpperCase()}
                      </CurrencyTicker>
                    </Box>
                  </>
                )}
                {!loading && currency.supportedCurrency && (
                  <>
                    {isCurrencySupported("BUY", currency.supportedCurrency) && (
                      <BuySwapBtn outlineGrey small mr={20} onClick={onBuy}>
                        Buy
                      </BuySwapBtn>
                    )}
                    {isCurrencySupported("SELL", currency.supportedCurrency) && (
                      <BuySwapBtn outlineGrey small onClick={onSwap}>
                        Swap
                      </BuySwapBtn>
                    )}
                  </>
                )}
              </Box>
            </div>
          </Cell>
          <Cell>
            {loading ? (
              <LoadingPlaceholder />
            ) : (
              <CounterValueFormatter value={currency.current_price} currency={counterCurrency} />
            )}
          </Cell>
          <Cell>
            {loading ? (
              <LoadingPlaceholder />
            ) : (
              currency.price_change_percentage_in_currency && (
                <FormattedVal
                  isPercent
                  animateTicker
                  isNegative
                  val={parseFloat(currency.price_change_percentage_in_currency.toFixed(2))}
                  inline
                  withIcon
                />
              )
            )}
          </Cell>
          <Cell>
            {loading ? (
              <LoadingPlaceholder />
            ) : (
              <CounterValueFormatter
                shorten
                currency={counterCurrency}
                value={currency.market_cap}
              />
            )}
          </Cell>
        </ItemRow>
      </Row>
    </div>
  );
}

export default memo<Props>(MarketRowItem);
