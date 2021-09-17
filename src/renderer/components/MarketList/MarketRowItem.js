// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import FormattedVal from "~/renderer/components/FormattedVal";
import { CurrencyLabel } from "~/renderer/components/AccountTagDerivationMode";
import Chart from "~/renderer/components/Chart";
import { colors } from "~/renderer/styles/theme";
import { BalanceHistoryData } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import FormattedDate from "~/renderer/components/FormattedDate";

const Cell = styled(Box)`
  padding: 15px 20px;
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
  justify-content: flex-start;
  margin-bottom: 9px;
  position: relative;
  transition: background-color ease-in-out 200ms;

  :hover {
    border-color: ${p => p.theme.colors.palette.text.shade20};
  }

  :active {
    border-color: ${p => p.theme.colors.palette.text.shade20};
    background: ${p => p.theme.colors.palette.action.hover};
  }
`;

const RowContent: ThemedComponent<{
  disabled?: boolean,
  isSubAccountsExpanded: boolean,
}> = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  opacity: ${p => ( p.disabled ? 0.3 : 1 )};
  padding-bottom: ${p => ( p.isSubAccountsExpanded ? "20px" : "0" )};
  height: 54px;

  & * {
    color: ${p => ( p.disabled ? p.theme.colors.palette.text.shade100 : "auto" )};
    fill: ${p => ( p.disabled ? p.theme.colors.palette.text.shade100 : "auto" )};
  }
`;

interface CurrencyRow {
  price: number;
  change: number;
  counterValue: number;
}

type Props = {
  name: string,
  short_name: string,
  currency: CurrencyRow,
};

export default function MarketRowItem<Props>(props) {
  // onBlur = (e: *) => {
  //   const { onEditName, account } = this.props;
  //   const { value } = e.target;
  //   if (!value && onEditName) {
  //     // don't leave an empty input on blur
  //     onEditName(account, account.name);
  //   }
  // };

  const overflowStyles = { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" };

  const {
    index,
    style,
    currency,
    counterValueCurrency,
  } = props;

  const renderTooltip = useCallback(
    (data: BalanceHistoryData) => <Tooltip data={data} counterValue={currency} range={currency.range} />,
    [currency.counterValue, currency.range],
  );

  return (
    <div style={{ ...style }}>
      <Row expanded={true}>
        <RowContent>
          <Cell
            style={{ maxWidth: "40px" }}
            flex="5%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            fontSize={4}
          >
            {index}
          </Cell>
          <Cell
            shrink
            grow
            flex="40%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            fontSize={4}
          >
            <CryptoCurrencyIcon currency={currency} size={20} />
            <div style={{ ...overflowStyles, paddingLeft: 15, marginLeft: 4, width: "100%" }}>
              {currency.name}
              <CurrencyLabel>{currency.ticker}</CurrencyLabel>
            </div>
          </Cell>
          <Cell
            shrink
            grow
            flex="10%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            justifyContent="flex-end"
            alignItems="center"
            fontSize={4}
          >
            {currency.price ? <FormattedVal
              style={{ textAlign: "right" }}
              val={currency.price}
              currency={currency}
              unit={counterValueCurrency.units[0]}
              showCode
            /> : null}
          </Cell>
          <Cell
            shrink
            grow
            flex="10%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            justifyContent="flex-end"
            alignItems="center"
            fontSize={4}
          >
            {currency.change ? <FormattedVal
              isPercent
              animateTicker
              isNegative
              val={Math.round(currency.change)}
              inline
              withIcon
            /> : null}
          </Cell>
          <Cell
            shrink
            grow
            flex="15%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            justifyContent="flex-start"
            fontSize={4}
          >
            <div style={{ maxWidth: "200px" }}>
              {/*<Chart*/}
              {/*  magnitude={currency.units[0].magnitude}*/}
              {/*  color={colors.wallet}*/}
              {/*  // $FlowFixMe TODO make date non optional*/}
              {/*  data={currency.portfolio.history}*/}
              {/*  height={20}*/}
              {/*  tickXScale={"day"}*/}
              {/*  renderTickY={() => ""}*/}
              {/*  renderTooltip={renderTooltip}*/}
              {/*  valueKey="countervalue"*/}
              {/*/>*/}
            </div>
          </Cell>
        </RowContent>
      </Row>
    </div>
  );
}

function Tooltip({ data, counterValue }: { data: BalanceHistoryData, counterValue: Currency }) {
  return (
    <>
      <FormattedVal
        alwaysShowSign={false}
        fontSize={5}
        color="palette.text.shade100"
        showCode
        unit={counterValue.units[0]}
        val={data.value}
      />
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
        <FormattedDate date={data.date} format="LL" />
      </Box>
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
        <FormattedDate date={data.date} format="LT" />
      </Box>
    </>
  );
}
