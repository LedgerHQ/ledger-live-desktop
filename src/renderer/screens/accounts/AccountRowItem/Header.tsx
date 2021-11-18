import React from "react";
import { getAccountCurrency, getAccountName } from "@ledgerhq/live-common/lib/account";
import { AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { Text, Tooltip } from "@ledgerhq/react-ui";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import Box from "~/renderer/components/Box";
import Ellipsis from "~/renderer/components/Ellipsis";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import AccountTagDerivationMode from "~/renderer/components/AccountTagDerivationMode";

type Props = {
  account: AccountLike;
  nested?: boolean;
};

const ICON_SIZE = 32;
const ROW_HEIGHT = 80;
const nestedIndicatorMargin = 4;
const nestedIndicatorHeight = ROW_HEIGHT - ICON_SIZE - nestedIndicatorMargin / 2;
const nestedIndicatorWidth = 1;

const NestedIndicator = styled.div`
  position: absolute;
  opacity: 0.5;
  top: ${-nestedIndicatorHeight / 2}px;
  left: ${(ICON_SIZE - nestedIndicatorWidth) / 2}px;
  height: ${nestedIndicatorHeight}px;
  width: ${nestedIndicatorWidth}px;
  background-color: ${p => p.theme.colors.palette.neutral.c40};
`;

const Header = ({ account, nested }: Props) => {
  const theme = useTheme();
  const currency = getAccountCurrency(account);
  const name = getAccountName(account);
  const color =
    currency.type === "CryptoCurrency" ? currency.color : theme.colors.palette.text.shade60;
  const title = currency.type === "CryptoCurrency" ? currency.name : "token";
  return (
    <Box horizontal flow={3} flex={nested ? "40%" : "30%"} pr={1} alignItems="center">
      <Box alignItems="center" justifyContent="center" style={{ color }}>
        <CryptoCurrencyIcon currency={currency} size={ICON_SIZE} />
        {nested && <NestedIndicator />}
      </Box>
      <Box style={{ flexShrink: 1 }}>
        {!nested && account.type === "Account" && (
          <Box horizontal alignItems="center" className="accounts-account-row-crypto-name">
            <Text variant="body" fontWeight="medium" color="palette.neutral.c100">
              {title} <AccountTagDerivationMode account={account} />
            </Text>
          </Box>
        )}
        <Tooltip delay={1200} content={name}>
          <Ellipsis>
            <Text variant="paragraph" fontWeight="medium" color="palette.neutral.c80">
              {name}
            </Text>
          </Ellipsis>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default React.memo<Props>(Header);