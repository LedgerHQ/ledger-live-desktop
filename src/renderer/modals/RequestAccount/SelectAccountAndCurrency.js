// @flow

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { useTranslation } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import Label from "~/renderer/components/Label";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Button from "~/renderer/components/Button";
import { useSelector, useDispatch } from "react-redux";
import { accountsSelector } from "~/renderer/reducers/accounts";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import FakeLink from "~/renderer/components/FakeLink";
import PlusIcon from "~/renderer/icons/Plus";
import { openModal } from "~/renderer/actions/modals";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies/sortByMarketcap";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ConfirmButton: ThemedComponent<{}> = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormContainer: ThemedComponent<{}> = styled.div`
  width: 100%;
  margin-top: 8px;
`;
const FormContent: ThemedComponent<{}> = styled.div`
  margin-top: 24px;
  width: 100%;
`;

type Props = {
  selectAccount: (account: AccountLike, parentAccount: ?Account) => void,
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
  allowAddAccount?: boolean,
  allowedCurrencies?: string[],
};

const AccountSelectorLabel = styled(Label)`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const SelectAccountAndCurrency = ({
  selectAccount,
  defaultCurrency,
  defaultAccount,
  allowAddAccount,
  allowedCurrencies,
}: Props) => {
  const { t } = useTranslation();
  const cryptoCurrencies = useMemo(() => {
    const supportedCurrencies = listSupportedCurrencies();

    return allowedCurrencies
      ? supportedCurrencies.filter(currency => {
          return allowedCurrencies.includes(currency.id);
        })
      : supportedCurrencies;
  }, [allowedCurrencies]);

  // sorting them by marketcap
  // $FlowFixMe - don't know why it fails
  const allCurrencies = useCurrenciesByMarketcap(cryptoCurrencies);

  const allAccounts = useSelector(accountsSelector);

  const {
    availableAccounts,
    currency,
    account,
    subAccount,
    setAccount,
    setCurrency,
  } = useCurrencyAccountSelect({
    allCurrencies,
    allAccounts,
    defaultCurrency: allCurrencies.length === 1 ? allCurrencies[0] : defaultCurrency,
    defaultAccount,
  });

  const dispatch = useDispatch();

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency }));
  }, [dispatch, currency]);

  return (
    <Container>
      <FormContainer>
        {currency ? <CurrencyDownStatusAlert currencies={[currency]} /> : null}
        {allCurrencies.length !== 1 ? (
          <FormContent>
            <Label>{t("exchange.buy.selectCrypto")}</Label>
            <SelectCurrency
              onChange={setCurrency}
              currencies={allCurrencies}
              value={currency || undefined}
            />
          </FormContent>
        ) : null}
        {currency ? (
          <FormContent>
            <AccountSelectorLabel>
              <span>{t("exchange.buy.selectAccount")}</span>
              {allowAddAccount ? (
                <FakeLink fontSize={3} ff="Inter|SemiBold" onClick={openAddAccounts}>
                  <PlusIcon size={10} />
                  <Text style={{ marginLeft: 4 }}>{t("exchange.buy.addAccount")}</Text>
                </FakeLink>
              ) : null}
            </AccountSelectorLabel>
            <SelectAccount
              accounts={availableAccounts}
              value={{ account, subAccount }}
              onChange={setAccount}
            />
          </FormContent>
        ) : null}
        <FormContent>
          <ConfirmButton
            primary
            onClick={() => {
              if (account) {
                if (subAccount) {
                  selectAccount(subAccount, account);
                } else {
                  selectAccount(account);
                }
              }
            }}
            disabled={!account}
          >
            {t("exchange.buy.continue")}
          </ConfirmButton>
        </FormContent>
      </FormContainer>
    </Container>
  );
};

export default SelectAccountAndCurrency;
