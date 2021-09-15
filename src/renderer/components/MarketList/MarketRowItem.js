// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import FormattedVal from "~/renderer/components/FormattedVal";
import { CurrencyLabel } from "~/renderer/components/AccountTagDerivationMode";

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
  //padding: 16px 20px;
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

  & * {
    color: ${p => ( p.disabled ? p.theme.colors.palette.text.shade100 : "auto" )};
    fill: ${p => ( p.disabled ? p.theme.colors.palette.text.shade100 : "auto" )};
  }
`;

type Props = {
  name: string,
  short_name: string,
  price: string
};

export default class MarketRowItem extends PureComponent<Props> {
  handlePreventSubmit = (e: SyntheticEvent<*>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleKeyPress = (e: SyntheticEvent<HTMLInputElement>) => {
    // this fixes a bug with the event propagating to the Tabbable
    e.stopPropagation();
  };

  // onToggleAccount = () => {
  //   const { onToggleAccount, account, isChecked } = this.props;
  //   if (onToggleAccount) onToggleAccount(account, !isChecked);
  // };

  handleChangeName = (name: string) => {
    const { onEditName, account } = this.props;
    if (onEditName) onEditName(account, name);
  };

  onClickInput = (e: SyntheticEvent<*>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  onFocus = (e: *) => {
    e.target.select();
  };

  // onBlur = (e: *) => {
  //   const { onEditName, account } = this.props;
  //   const { value } = e.target;
  //   if (!value && onEditName) {
  //     // don't leave an empty input on blur
  //     onEditName(account, account.name);
  //   }
  // };

  overflowStyles = { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" };

  render() {
    const {
      order_number,
      style,
      currency,
      counterValueCurrency,
    } = this.props;

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
              {order_number}
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
              <div style={{ ...this.overflowStyles, paddingLeft: 15, marginLeft: 4, width: "100%" }}>
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
              {currency.counterValue ? <FormattedVal
                style={{ textAlign: "right" }}
                val={currency.counterValue}
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
              1
            </Cell>
          </RowContent>
        </Row>
      </div>
    );
  }
}
