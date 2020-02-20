// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { setExchangePairsAction } from "~/renderer/actions/settings";
import type { TimeRange } from "~/renderer/reducers/settings";
import Box from "~/renderer/components/Box";
import Price from "~/renderer/components/Price";
import SelectExchange from "~/renderer/components/SelectExchange";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import PriceGraph from "./PriceGraph";

export const RateRowWrapper: ThemedComponent<{}> = styled.div`
  flex-direction: row;
  margin: 0px 24px;
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  &:after {
    left: 0;
    right: 0;
  }
  &:last-of-type {
    border: none;
  }
  &:first-of-type {
    height: 65px;
  }

  > * {
    flex: 1;
    &:nth-child(1) {
      flex: 0.75;
    }
    &:nth-child(2) {
      width: 300px;
    }
    &:nth-child(4) {
      > * {
        min-width: 100px;
      }
    }
  }
`;

const RateTypeBar = styled.div`
  width: 2px;
  height: 16px;
  margin-right: 8px;
  background-color: ${p =>
    p.theme.colors[p.currencyType === "FiatCurrency" ? "wallet" : "identity"]};
`;

const NoDataContainer = styled(Box)`
  white-space: nowrap;
`;

const NoData = () => (
  <NoDataContainer ff="Inter|SemiBold" color="palette.text.shade40" fontSize={4}>
    <Trans style={{ whiteSpace: "nowrap" }} i18nKey="settings.rates.noCounterValue" />
  </NoDataContainer>
);

type Props = {
  from: Currency,
  to: Currency,
  exchange: ?string,
  timeRange: TimeRange,
};

const RateRow = ({ from, to, exchange, timeRange }: Props) => {
  const dispatch = useDispatch();

  const handleChangeExchange = useCallback(
    newExchange => {
      dispatch(
        setExchangePairsAction([
          {
            from,
            to,
            exchange: newExchange && newExchange.id,
          },
        ]),
      );
    },
    [dispatch, from, to],
  );

  return (
    <RateRowWrapper>
      <Box
        ff="Inter|Regular"
        horizontal
        alignItems="center"
        color="palette.text.shade100"
        fontSize={4}
      >
        <RateTypeBar currencyType={to.type} />
        <Trans i18nKey="settings.rates.fromTo" values={{ from: from.ticker, to: to.ticker }} />
      </Box>
      <div>
        <Price
          withEquality
          from={from}
          to={to}
          color="palette.text.shade80"
          fontSize={3}
          placeholder={<NoData />}
        />
      </div>
      <div>
        <PriceGraph
          timeRange={timeRange}
          from={from}
          to={to}
          width={150}
          height={40}
          exchange={exchange}
          placeholder={null}
        />
      </div>
      <SelectExchange
        small
        from={from}
        to={to}
        exchangeId={exchange}
        onChange={handleChangeExchange}
        minWidth={200}
      />
    </RateRowWrapper>
  );
};

export default RateRow;
