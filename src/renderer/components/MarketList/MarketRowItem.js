// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { darken } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box, { Tabbable } from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";

const InputWrapper = styled.div`
  margin-left: 4px;
  width: 100%;
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
  padding: 16px 20px;
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
      short_name,
      name,
      style
    } = this.props;

    // const tag = <AccountTagDerivationMode account={account} />;
    return (
      <div style={style} className="accounts-account-row-item">
        <Row expanded={true}>
          <RowContent
            className="accounts-account-row-item-content"
          >
            <Box
              flex="5%"
              shrink={1}
              ff="Inter|SemiBold"
              color="palette.text.shade100"
              horizontal
              alignItems="center"
              fontSize={4}
            >
              {order_number}
            </Box>
            <CryptoCurrencyIcon currency={this.props} size={20} />
            <Box
              shrink
              grow
              flex="30%"
              ff="Inter|SemiBold"
              color="palette.text.shade100"
              horizontal
              alignItems="center"
              fontSize={4}
            >
              <div style={{ ...this.overflowStyles, paddingLeft: 15, marginLeft: 4, width: "100%" }}>
                {name}
                {/*<Box*/}
                {/*  alignItems="center"*/}
                {/*  color="palette.text.shade60"*/}
                {/*  fontSize={14}*/}
                {/*  horizontal={true}*/}
                {/*  style={{ textTransform: "uppercase" }}*/}
                {/*>*/}
                {/*  {short_name}*/}
                {/*</Box>*/}
                {/*{tag}*/}
              </div>
            </Box>
            <Box
              shrink
              grow
              ff="Inter|SemiBold"
              color="palette.text.shade100"
              horizontal
              alignItems="center"
              fontSize={4}
            >
              $55,540.24
            </Box>
            <Box
              shrink
              grow
              ff="Inter|SemiBold"
              color="palette.text.shade100"
              horizontal
              alignItems="center"
              fontSize={4}
            >
              0.79%
            </Box>
          </RowContent>
        </Row>
      </div>
    );
  }
}

const AccountRowContainer: ThemedComponent<{
  isDisabled?: boolean,
}> = styled(Tabbable).attrs(() => ( {
  horizontal: true,
  alignItems: "center",
  bg: "palette.background.default",
  px: 3,
  flow: 1,
} ))`
  height: 48px;
  border-radius: 4px;

  opacity: ${p => ( p.isDisabled ? 0.5 : 1 )};
  pointer-events: ${p => ( p.isDisabled ? "none" : "auto" )};

  &:hover {
    background-color: ${p => darken(p.theme.colors.palette.background.default, 0.015)};
  }

  &:active {
    background-color: ${p => darken(p.theme.colors.palette.background.default, 0.03)};
  }
`;
