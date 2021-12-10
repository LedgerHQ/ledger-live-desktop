// @flow
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { getAccountUnit, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import { fromSelector } from "~/renderer/actions/swap";
import InputCurrency from "~/renderer/components/InputCurrency";
import { ErrorContainer } from "~/renderer/components/Input";
import { SelectAccount } from "~/renderer/components/SelectAccount";
import Switch from "~/renderer/components/Switch";
import Text from "~/renderer/components/Text";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { amountInputContainerProps, renderAccountValue, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import type {
  SwapSelectorStateType,
  SwapTransactionType,
} from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import { track } from "~/renderer/analytics/segment";
import { SWAP_VERSION } from "../../utils/index";

import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies/sortByMarketcap";
import { listCryptoCurrencies, listTokens } from "@ledgerhq/live-common/lib/currencies";

// Pick a default source account if none are selected.
// TODO use live-common once its ready
const usePickDefaultAccount = (accounts, fromAccount, setFromAccount): void => {
  const list = [...listCryptoCurrencies(), ...listTokens()];
  const allCurrencies = useCurrenciesByMarketcap(list);

  useEffect(() => {
    if (!fromAccount && allCurrencies.length > 0) {
      allCurrencies.some(({ id }) => {
        const filteredAcc = accounts.filter(
          acc => getAccountCurrency(acc)?.id === id && acc.balance.gt(0) && !acc.disabled,
        );

        if (filteredAcc.length > 0) {
          const defaultAccount = filteredAcc
            .sort((a, b) => b.balance.minus(a.balance).toNumber())
            .find(Boolean);

          setFromAccount(defaultAccount);
          return true;
        }
        return false;
      });
    }
  }, [accounts, allCurrencies, fromAccount, setFromAccount]);
};

type Props = {
  fromAccount: $PropertyType<SwapSelectorStateType, "account">,
  setFromAccount: $PropertyType<SwapTransactionType, "setFromAccount">,
  toggleMax: $PropertyType<SwapTransactionType, "toggleMax">,
  fromAmount: $PropertyType<SwapSelectorStateType, "amount">,
  setFromAmount: $PropertyType<SwapTransactionType, "setFromAmount">,
  isMaxEnabled: boolean,
  fromAmountError?: Error,
  provider: ?string,
};

/* @dev: Yeah, Im sorry if you read this, design asked us to
 override the input component when it is called from the swap form. */
const InputSection = styled(Box)`
  & ${ErrorContainer} {
    font-weight: 500;
    font-size: 11px;
    text-align: right;
    margin-left: calc(calc(100% + 45px) * -1);
    width: calc(calc(100% + 30px) * 2);
    margin-top: 6px;
  }
`;

function FromRow({
  fromAmount,
  setFromAmount,
  fromAccount,
  setFromAccount,
  isMaxEnabled,
  toggleMax,
  fromAmountError,
  provider,
}: Props) {
  const accounts = useSelector(fromSelector)(useSelector(shallowAccountsSelector));
  const unit = fromAccount && getAccountUnit(fromAccount);
  const { t } = useTranslation();
  usePickDefaultAccount(accounts, fromAccount, setFromAccount);
  const trackEditAccount = () =>
    track("Page Swap Form - Edit Source Account", {
      provider,
      swapVersion: SWAP_VERSION,
    });
  const setAccountAndTrack = account => {
    track("Page Swap Form - New Source Account", {
      provider,
      swapVersion: SWAP_VERSION,
    });
    setFromAccount(account);
  };

  return (
    <>
      <Box
        horizontal
        justifyContent="space-between"
        alignItems="flex-end"
        fontSize={3}
        mb={1}
        color={"palette.text.shade40"}
      >
        <FormLabel>{t("swap2.form.from.title")}</FormLabel>
        <Box horizontal alignItems="center">
          <Text ff="Inter|Medium" marginRight={1} fontSize={2}>
            {t("swap2.form.from.max")}
          </Text>
          <Switch
            small
            isChecked={isMaxEnabled}
            onChange={toggleMax}
            disabled={!fromAccount}
            data-test-id="swap-max-spendable-toggle"
          />
        </Box>
      </Box>
      <Box horizontal boxShadow="0px 2px 4px rgba(0, 0, 0, 0.05);">
        <Box width="50%">
          <SelectAccount
            accounts={accounts}
            value={fromAccount}
            // $FlowFixMe
            onChange={setAccountAndTrack}
            stylesMap={selectRowStylesMap}
            placeholder={t("swap2.form.from.accountPlaceholder")}
            showAddAccount
            isSearchable={false}
            disabledTooltipText={t("swap2.form.from.currencyDisabledTooltip")}
            renderValue={renderAccountValue}
            onMenuOpen={trackEditAccount}
          />
        </Box>
        <InputSection width="50%">
          <InputCurrency
            value={fromAmount}
            onChange={setFromAmount}
            disabled={!fromAccount || isMaxEnabled}
            placeholder="0"
            textAlign="right"
            fontWeight={600}
            containerProps={amountInputContainerProps}
            // $FlowFixMe
            unit={unit}
            // Flow complains if this prop is missing…
            renderRight={null}
            error={fromAmountError}
          />
        </InputSection>
      </Box>
    </>
  );
}

export default React.memo<Props>(FromRow);
