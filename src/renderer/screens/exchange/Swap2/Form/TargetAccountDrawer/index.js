// @flow
import React, { memo, useState, useEffect, useCallback } from "react";
import styled, { useTheme } from "styled-components";
import { DrawerTitle } from "../DrawerTitle";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import Check from "~/renderer/icons/Check";
import type { SwapTransactionType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import Tabbable from "~/renderer/components/Box/Tabbable";

const AccountWrapper = styled(Tabbable)`
  cursor: pointer;
  ${p =>
    p.selected
      ? `
    background-color: ${p.theme.colors.lightGrey};
  `
      : ""};
`;

const TargetAccount = memo(function TargetAccount({
  account,
  selected,
  setAccount,
}: {
  account: AccountLike,
  selected?: boolean,
  setAccount: $PropertyType<Props, "setToAccount">,
}) {
  const theme = useTheme();
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const name = getAccountName(account);
  const balance =
    account.type !== "ChildAccount" && account.spendableBalance
      ? account.spendableBalance
      : account.balance;
  const onClick = useCallback(() => setAccount(currency, account), [setAccount, account]);

  return (
    <AccountWrapper
      horizontal
      p={3}
      justifyContent="space-between"
      selected={selected}
      onClick={onClick}
    >
      <Box horizontal alignItems="center">
        <Box mr={3}>
          <CryptoCurrencyIcon currency={currency} size={16} />
        </Box>
        <Text ff="Inter|SemiBold" fontSize={5}>
          {name}
        </Text>
      </Box>
      <Box position="relative" pr={5}>
        <FormattedVal
          color="palette.text.shade50"
          ff="Inter|Medium"
          fontSize={5}
          val={balance}
          unit={unit}
          showCode
        />
        {selected && (
          <Box position="absolute" height="100%" justifyContent="center" style={{ right: 0 }}>
            <Check size={16} color={theme.colors.palette.primary.main} />
          </Box>
        )}
      </Box>
    </AccountWrapper>
  );
});

type Props = {
  accounts: AccountLike[],
  selectedAccount: AccountLike,
  setToAccount: $PropertyType<SwapTransactionType, "setToAccount">,
  setSelectedAccountRef: { current: ?(AccountLike) => void },
};
export default function TargetAccountDrawer({
  accounts,
  selectedAccount: initialSelectedAccount,
  setToAccount,
  setSelectedAccountRef,
}: Props) {
  const [selectedAccount, setSelectedAccount] = useState(initialSelectedAccount);
  useEffect(() => {
    setSelectedAccountRef.current = setSelectedAccount;
    return () => {
      setSelectedAccountRef.current = null;
    };
  }, [setSelectedAccountRef]);
  return (
    <Box height="100%">
      <DrawerTitle i18nKey="swap2.form.to.title" />
      <Box>
        {accounts.map(account => (
          <TargetAccount
            key={account.id}
            account={account}
            selected={selectedAccount?.id === account.id}
            setAccount={setToAccount}
          />
        ))}
      </Box>
    </Box>
  );
}
