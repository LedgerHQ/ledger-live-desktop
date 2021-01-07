// @flow

import React from "react";
import styled from "styled-components";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import FormattedVal from "~/renderer/components/FormattedVal";
import Ellipsis from "~/renderer/components/Ellipsis";
import Box from "~/renderer/components/Box";
import useTheme from "~/renderer/hooks/useTheme";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import type { Account, AccountLike, SubAccount } from "@ledgerhq/live-common/lib/types/account";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const OptionContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const AccountRowContainer: ThemedComponent<{
  nested?: boolean,
  disabled?: boolean,
}> = styled.div.attrs(p => ({
  style: {
    paddingTop: p.nested ? 3 : 0,
    color: p.disabled ? p.theme.colors.palette.text.shade40 : "inherit",
  },
}))`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
`;

const NestingIndicator: ThemedComponent<{}> = styled.div`
  padding-right: 16px;
  border-left: ${p => p.theme.colors.palette.text.shade40} 1px solid;
  margin-left: 6px;
`;

const Left: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const Right: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
`;

const IconContainer: ThemedComponent<{}> = styled.div`
  padding-right: 6px;
`;

function AccountRow({
  account,
  parentAccount,
  nested,
  disabled,
}: {
  account: AccountLike,
  parentAccount?: Account,
  nested?: boolean,
  disabled?: boolean,
}) {
  const palette = useTheme("colors.palette");

  return (
    <AccountRowContainer nested={nested} disabled={disabled}>
      <Left>
        {nested ? <NestingIndicator /> : null}
        <IconContainer>
          {parentAccount ? (
            <ParentCryptoCurrencyIcon
              overrideColor={disabled ? palette.text.shade40 : undefined}
              size={16}
              currency={getAccountCurrency(account)}
            />
          ) : (
            <CryptoCurrencyIcon
              overrideColor={disabled ? palette.text.shade40 : undefined}
              size={16}
              currency={getAccountCurrency(account)}
            />
          )}
        </IconContainer>
        <Box flex={1}>
          <Ellipsis ff="Inter|SemiBold" fontSize={4}>
            {getAccountName(account)}
          </Ellipsis>
        </Box>
      </Left>
      <Right>
        <FormattedVal
          color={disabled ? palette.text.shade40 : palette.text.shade60}
          val={account.balance}
          unit={getAccountUnit(account)}
          showCode
        />
      </Right>
    </AccountRowContainer>
  );
}

type Props = {
  account: Account,
  subAccount?: SubAccount,
  isValue?: boolean,
};

export function MenuOption({ account, subAccount, isValue }: Props) {
  if (isValue) {
    return (
      <OptionContainer>
        {subAccount ? (
          <AccountRow parentAccount={account} account={subAccount} />
        ) : (
          <AccountRow account={account} />
        )}
      </OptionContainer>
    );
  }

  return (
    <OptionContainer>
      <AccountRow account={account} disabled={!!subAccount} />
      {subAccount ? <AccountRow nested account={subAccount} /> : null}
    </OptionContainer>
  );
}
