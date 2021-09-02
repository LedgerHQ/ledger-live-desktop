// @flow
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import { fromSelector } from "~/renderer/actions/swap";
import InputCurrency from "~/renderer/components/InputCurrency";
import { SelectAccount } from "~/renderer/components/SelectAccount";
import Switch from "~/renderer/components/Switch";
import Text from "~/renderer/components/Text";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { amountInputContainerProps, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import type {
  SwapSelectorStateType,
  SwapTransactionType,
} from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

type Props = {
  fromAccount: $PropertyType<SwapSelectorStateType, "account">,
  setFromAccount: $PropertyType<SwapTransactionType, "setFromAccount">,
  toggleMax: $PropertyType<SwapTransactionType, "toggleMax">,
  fromAmount: $PropertyType<SwapSelectorStateType, "amount">,
  setFromAmount: $PropertyType<SwapTransactionType, "setFromAmount">,
  isMaxEnabled: boolean,
  fromAmountError?: Error,
};

function FromRow({
  fromAmount,
  setFromAmount,
  fromAccount,
  setFromAccount,
  isMaxEnabled,
  toggleMax,
  fromAmountError,
}: Props) {
  const accounts = useSelector(fromSelector)(useSelector(shallowAccountsSelector));
  const unit = fromAccount && getAccountUnit(fromAccount);
  const { t } = useTranslation();

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
          <Switch medium isChecked={isMaxEnabled} onChange={toggleMax} disabled={!fromAccount} />
        </Box>
      </Box>
      <Box horizontal mb="40px" boxShadow="0px 2px 4px rgba(0, 0, 0, 0.05);">
        <Box width="50%">
          <SelectAccount
            accounts={accounts}
            value={fromAccount}
            // $FlowFixMe
            onChange={setFromAccount}
            stylesMap={selectRowStylesMap}
            placeholder={t("swap2.form.from.accountPlaceholder")}
            showAddAccount
            isSearchable={false}
            disabledTooltipText={t("swap2.form.from.currencyDisabledTooltip")}
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
            error={fromAmountError}
          />
        </Box>
      </Box>
    </>
  );
}

export default FromRow;
