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
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";

const AccountName: ThemedComponent<{}> = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

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
  padding: 10px 15px;
  width: 200px;
  border-radius: 4px;
  border: 1px solid transparent;
  &:hover ${AccountName},&:active ${AccountName} {
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
    parentAccountId
      ? history.push(`/account/${parentAccountId}/${account.id}`)
      : history.push(`/account/${account.id}`);
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
            <Ellipsis color="palette.text.shade80">{getAccountName(account)}</Ellipsis>
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
