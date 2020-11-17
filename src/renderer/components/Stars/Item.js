// @flow
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account/helpers";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";

import Hide from "~/renderer/components/MainSideBar/Hide";
import FormattedVal from "~/renderer/components/FormattedVal";
import Box from "~/renderer/components/Box";
import Ellipsis from "~/renderer/components/Ellipsis";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";

const ParentCryptoCurrencyIconWrapper: ThemedComponent<{}> = styled.div`
  width: 20px;
`;

const ItemWrapper: ThemedComponent<{ active: boolean }> = styled.div.attrs(p => ({
  style: {
    backgroundColor: p.active
      ? p.theme.colors.palette.action.hover
      : p.theme.colors.palette.background.paper,
  },
}))`
  flex: 1;
  align-items: center;
  display: flex;
  padding: 6px 15px;
  width: 200px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  margin: 2px 0px;
  color: ${p =>
    p.active ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade80};

  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

type Props = {
  account: AccountLike,
  index: number,
  pathname: string,
  collapsed?: boolean,
};

const Item = ({ account, index, pathname, collapsed }: Props) => {
  const history = useHistory();
  const active = pathname.endsWith(account.id);

  const onAccountClick = useCallback(() => {
    const parentAccountId = account.type !== "Account" ? account.parentId : undefined;

    history.push({
      pathname: parentAccountId
        ? `/account/${parentAccountId}/${account.id}`
        : `/account/${account.id}`,
      state: { source: "starred account item" },
    });
  }, [account, history]);

  const unit = getAccountUnit(account);

  return (
    <ItemWrapper collapsed={collapsed} active={active} onClick={onAccountClick}>
      <Box horizontal ff="Inter|SemiBold" flex={1} flow={3} alignItems="center">
        <ParentCryptoCurrencyIconWrapper
          collapsed={collapsed}
          isToken={account.type === "TokenAccount"}
        >
          <ParentCryptoCurrencyIcon inactive={!active} currency={getAccountCurrency(account)} />
        </ParentCryptoCurrencyIconWrapper>
        <Box vertical flex={1}>
          <Hide visible={!collapsed}>
            <Ellipsis>{getAccountName(account)}</Ellipsis>
            <FormattedVal
              alwaysShowSign={false}
              animateTicker={false}
              ellipsis
              color="palette.text.shade60"
              unit={unit}
              showCode
              val={account.balance}
            />
          </Hide>
        </Box>
      </Box>
    </ItemWrapper>
  );
};

export default Item;
