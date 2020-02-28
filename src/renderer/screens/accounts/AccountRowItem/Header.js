// @flow

import React from "react";
import { getAccountCurrency, getAccountName } from "@ledgerhq/live-common/lib/account";
import type { AccountLike } from "@ledgerhq/live-common/lib/types/account";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import Box from "~/renderer/components/Box";
import Ellipsis from "~/renderer/components/Ellipsis";
import Tooltip from "~/renderer/components/Tooltip";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";

type Props = {
  account: AccountLike,
  nested?: boolean,
};

// NB Inside Head to not break alignment with parent row;
// and this is in fact not seen, because we draw on top
// from AccountRowItem/index.js TokenBarIndicator
const NestedIndicator = styled.div`
  height: 44px;
  width: 14px;
`;

const Header = ({ account, nested }: Props) => {
  const theme = useTheme();
  const currency = getAccountCurrency(account);
  const name = getAccountName(account);
  const color =
    currency.type === "CryptoCurrency" ? currency.color : theme.colors.palette.text.shade60;
  const title = currency.type === "CryptoCurrency" ? currency.name : "token";
  return (
    <Box
      horizontal
      ff="Inter|SemiBold"
      flow={3}
      flex={`${nested ? 42 : 30}%`}
      pr={1}
      alignItems="center"
    >
      {nested && <NestedIndicator />}
      <Box alignItems="center" justifyContent="center" style={{ color }}>
        <CryptoCurrencyIcon currency={currency} size={20} />
      </Box>
      <Box style={{ flexShrink: 1 }}>
        {!nested && account.type === "Account" && (
          <Box style={{ textTransform: "uppercase" }} fontSize={9} color="palette.text.shade60">
            {title}
          </Box>
        )}
        <Tooltip delay={1200} content={name}>
          <Ellipsis fontSize={12} color="palette.text.shade100">
            {name}
          </Ellipsis>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default React.memo<Props>(Header);
