// @flow
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { BigNumber } from "bignumber.js";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import { SelectAccount } from "~/renderer/components/SelectAccount";
import Switch from "~/renderer/components/Switch";
import Text from "~/renderer/components/Text";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { amountInputContainerProps, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";

type Props = {
  fromAccount: { account: Account | TokenAccount, parentAccount: ?Account } | null,
  setFromAccount: (pickedAccount: Account | TokenAccount, accounts: Array<Account>) => void,
  isMaxEnabled: boolean,
  setIsMaxEnabled: ((boolean) => boolean) => void,
  fromAmount: ?BigNumber,
  setFromAmount: BigNumber => void,
};

function FromRow({
  fromAmount,
  setFromAmount,
  fromAccount,
  setFromAccount,
  isMaxEnabled,
  setIsMaxEnabled,
}: Props) {
  const accounts = useSelector(shallowAccountsSelector);
  const unit = fromAccount && getAccountUnit(fromAccount?.account);
  const { t } = useTranslation();

  const handleAccountChange = pickedAccount => {
    if (pickedAccount === null || pickedAccount === undefined) return;
    // $FlowFixMe (because the select account returns me the ChildAccount type)
    setFromAccount(pickedAccount, accounts);
  };

  const handleMaxChange = async () => {
    if (!fromAccount) return;
    setIsMaxEnabled(value => !value);
  };

  return (
    <>
      <Box
        horizontal
        justifyContent="space-between"
        alignItems="flex-end"
        fontSize={3}
        mb={2}
        color={"palette.text.shade40"}
      >
        <FormLabel>{t("swap2.form.from.title")}</FormLabel>
        <Box horizontal alignItems="center">
          <Text marginRight={1} fontWeight="500">
            {t("swap2.form.from.max")}
          </Text>
          <Switch
            medium
            isChecked={isMaxEnabled}
            onChange={handleMaxChange}
            disabled={!fromAccount}
          />
        </Box>
      </Box>
      <Box horizontal mb="26px" boxShadow="0px 2px 4px rgba(0, 0, 0, 0.05);">
        <Box width="50%">
          <SelectAccount
            accounts={accounts}
            value={fromAccount?.account}
            // $FlowFixMe
            onChange={handleAccountChange}
            stylesMap={selectRowStylesMap}
            placeholder={t("swap2.form.from.accountPlaceholder")}
            withSubAccounts
          />
        </Box>
        <Box width="50%">
          <InputCurrency
            value={fromAmount}
            onChange={setFromAmount}
            disabled={!fromAccount || isMaxEnabled}
            placeholder="0"
            textAlign="right"
            containerProps={amountInputContainerProps}
            // $FlowFixMe
            unit={unit}
            // Flow complains if this prop is missing…
            renderRight={null}
          />
        </Box>
      </Box>
    </>
  );
}

export default FromRow;
