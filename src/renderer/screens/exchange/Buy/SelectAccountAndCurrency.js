// @flow

import React, { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import ExchangeDollar from "~/renderer/icons/ExchangeDollar";
import { rgba } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import { useTranslation } from "react-i18next";
import { getAccountsForCurrency, useCoinifyCurrencies } from "~/renderer/screens/exchange/hooks";
import { SelectAccount } from "~/renderer/components/SelectAccount";
import Label from "~/renderer/components/Label";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Button from "~/renderer/components/Button";
import { useSelector, useDispatch } from "react-redux";
import { accountsSelector } from "~/renderer/reducers/accounts";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types/account";
import FakeLink from "~/renderer/components/FakeLink";
import PlusIcon from "~/renderer/icons/Plus";
import { openModal } from "~/renderer/actions/modals";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{}> = styled.div`
  width: 365px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.2)};
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-bottom: 32px;
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
  selectAccount: (account: Account | TokenAccount) => undefined,
};

const AccountSelectorLabel = styled(Label)`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const SelectAccountAndCurrency = ({ selectAccount }: Props) => {
  const { t } = useTranslation();
  const allAccounts = useSelector(accountsSelector);

  const currencies = useCoinifyCurrencies();
  const [state, setState] = useState(() => {
    const defaultCurrency = currencies.length ? currencies[0] : null;

    return {
      currency: defaultCurrency,
      account: null,
    };
  });

  // this effect make sure to set the bottom select to a newly created account
  useEffect(() => {
    setState(oldState => {
      const accountsForDefaultCurrency = getAccountsForCurrency(state.currency, allAccounts);
      const defaultAccount = accountsForDefaultCurrency.length
        ? accountsForDefaultCurrency[0]
        : null;

      return {
        ...oldState,
        account: defaultAccount,
      };
    });
  }, [allAccounts, state.currency]);

  const dispatch = useDispatch();

  const accounts = useMemo(
    () => (state.currency ? getAccountsForCurrency(state.currency, allAccounts) : []),
    [state.currency, allAccounts],
  );

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return (
    <Container>
      <IconContainer>
        <ExchangeDollar size={24} />
      </IconContainer>
      <Text ff="Inter|SemiBold" fontSize={5} color="palette.text.shade100">
        {t("exchange.buy.title")}
      </Text>
      <FormContainer>
        <FormContent>
          <Label>{t("exchange.buy.selectCrypto")}</Label>
          <SelectCurrency
            onChange={currency => {
              const accountsForSelectedcurrency = getAccountsForCurrency(currency, allAccounts);
              setState({
                currency,
                account: accountsForSelectedcurrency.length ? accountsForSelectedcurrency[0] : null,
              });
            }}
            currencies={currencies}
            value={state.currency}
          />
        </FormContent>
        <FormContent>
          <AccountSelectorLabel>
            <span>{t("exchange.buy.selectAccount")}</span>
            <FakeLink fontSize={3} ff="Inter|SemiBold" onClick={openAddAccounts}>
              <PlusIcon size={10} />
              <Text style={{ marginLeft: 4 }}>{t("exchange.buy.addAccount")}</Text>
            </FakeLink>
          </AccountSelectorLabel>
          <SelectAccount
            accounts={accounts}
            isDisabled={accounts.length === 0}
            onChange={acc => {
              setState(oldState => ({
                ...oldState,
                account: acc,
              }));
            }}
            value={state.account}
          />
        </FormContent>
        <FormContent>
          <ConfirmButton
            primary
            onClick={() => {
              if (state.account) {
                selectAccount(state.account);
              }
            }}
            disabled={!state.account}
          >
            {t("exchange.buy.continue")}
          </ConfirmButton>
        </FormContent>
      </FormContainer>
    </Container>
  );
};

export default SelectAccountAndCurrency;
