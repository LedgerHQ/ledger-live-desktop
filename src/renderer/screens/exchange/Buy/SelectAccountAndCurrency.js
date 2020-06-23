// @flow

import invariant from "invariant";
import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Exchange from "~/renderer/icons/Exchange";
import { rgba } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import { useTranslation } from "react-i18next";
import { getAccountsForCurrency, useCoinifyCurrencies } from "~/renderer/screens/exchange/hooks";
// import { SelectAccount } from "~/renderer/components/SelectAccount";
import SelectAccount from "~/renderer/components/PerCurrencySelectAccount";
import Label from "~/renderer/components/Label";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Button from "~/renderer/components/Button";
import { useSelector, useDispatch } from "react-redux";
import { accountsSelector } from "~/renderer/reducers/accounts";
import type { Account, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import FakeLink from "~/renderer/components/FakeLink";
import PlusIcon from "~/renderer/icons/Plus";
import { openModal } from "~/renderer/actions/modals";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getAccountCurrency, isAccountEmpty } from "@ledgerhq/live-common/lib/account/helpers";
import { track } from "~/renderer/analytics/segment";
import type { AccountLike } from "@ledgerhq/live-common/lib/types/account";

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
  color: ${p => p.theme.colors.palette.primary.main};
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
  selectAccount: (account: AccountLike, parentAccount: ?Account) => void,
};

type State = {
  currency: ?(CryptoCurrency | TokenCurrency),
  account: ?AccountLike,
  parentAccount: ?Account,
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
  const [{ currency, account, parentAccount }, setState] = useState<State>(() => {
    const defaultCurrency = currencies[0];

    return {
      currency: defaultCurrency,
      account: null,
      parentAccount: null,
    };
  });

  const mainCurrency = currency
    ? currency.type === "TokenCurrency"
      ? currency.parentCurrency
      : currency
    : null;
  // this effect make sure to set the bottom select to a newly created account
  useEffect(() => {
    if (!mainCurrency) return;
    if (currency && account && getAccountCurrency(account).id === currency.id) return; // already of the current currency
    setState(oldState => {
      if (!currency) {
        return oldState;
      }
      const accountsForDefaultCurrency = getAccountsForCurrency(currency, allAccounts);
      const defaultAccount = accountsForDefaultCurrency.length
        ? accountsForDefaultCurrency[0]
        : null;

      return {
        ...oldState,
        account: defaultAccount,
      };
    });
  }, [allAccounts, account, mainCurrency, currency]);

  const dispatch = useDispatch();

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency }));
  }, [dispatch, currency]);

  return (
    <Container>
      <IconContainer>
        <Exchange size={24} />
      </IconContainer>
      <Text ff="Inter|SemiBold" fontSize={5} color="palette.text.shade100">
        {t("exchange.buy.title")}
      </Text>
      <FormContainer>
        <FormContent>
          <Label>{t("exchange.buy.selectCrypto")}</Label>
          <SelectCurrency
            onChange={currency => {
              invariant(!currency || currency.type !== "FiatCurrency", "not a fiat currency");
              const accountsForSelectedcurrency = currency
                ? getAccountsForCurrency(currency, allAccounts)
                : [];
              setState({
                currency,
                account: accountsForSelectedcurrency.length ? accountsForSelectedcurrency[0] : null,
                parentAccount: null,
              });
            }}
            currencies={currencies}
            value={currency || undefined}
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
          {currency ? (
            <SelectAccount
              accounts={allAccounts}
              currency={currency}
              mandatoryTokens
              onChange={(account, parentAccount) => {
                console.log(account, parentAccount);
                setState(oldState => ({
                  ...oldState,
                  account: account,
                  parentAccount: parentAccount,
                }));
              }}
              value={parentAccount || account}
            />
          ) : null}
        </FormContent>
        <FormContent>
          <ConfirmButton
            primary
            onClick={() => {
              if (account) {
                track("Buy Crypto Continue Button", {
                  currencyName: getAccountCurrency(account).name,
                  isEmpty: isAccountEmpty(account),
                });
                selectAccount(account, parentAccount);
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
