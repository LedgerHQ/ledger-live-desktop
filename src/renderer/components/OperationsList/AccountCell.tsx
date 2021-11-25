import React, { PureComponent } from "react";
import styled from "styled-components";
import { Currency } from "@ledgerhq/live-common/lib/types";
import { Text, Flex } from "@ledgerhq/react-ui";
import Box from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import Tooltip from "~/renderer/components/Tooltip";

const Cell = styled(Box).attrs(() => ({
  px: 4,
  horizontal: true,
  alignItems: "center",
}))`
  flex: 1 1 auto;
  overflow: hidden;
  max-width: 400px;
`;

type Props = {
  currency: Currency;
  accountName: string;
};

class AccountCell extends PureComponent<Props> {
  render() {
    const { currency, accountName } = this.props;
    return (
      <Cell horizontal flow={2}>
        <Flex alignItems="center" justifyContent="center">
          <CryptoCurrencyIcon size={24} currency={currency} />
        </Flex>
        <Tooltip delay={1200} content={accountName}>
          <Ellipsis>
            <Text ml={3} variant="paragraph" fontWeight="medium" color="palette.neutral.c100">
              {accountName}
            </Text>
          </Ellipsis>
        </Tooltip>
      </Cell>
    );
  }
}

export default AccountCell;
