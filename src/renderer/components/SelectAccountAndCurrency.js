// @flow

import React, { useCallback } from "react";
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
import { openModal, closeModal } from "~/renderer/actions/modals";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";

const Container: ThemedComponent<{}> = styled.div`
  min-width: 365px;
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
  allCurrencies: Array<TokenCurrency | CryptoCurrency>,
  defaultCurrencyId?: ?string,
  defaultAccountId?: ?string,
  allowAddAccount?: boolean,
  allowedCurrencies?: string[],
  confirmCb?: Account => void,
  flow?: string,
};

const AccountSelectorLabel = styled(Label)`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;
const SelectAccountAndCurrency = ({
  selectAccount,
  allCurrencies,
  defaultCurrencyId,
  defaultAccountId,
  allowAddAccount,
  allowedCurrencies,
  confirmCb,
  flow,
}: Props) => {
  const { t } = useTranslation();

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
    defaultCurrencyId,
    defaultAccountId,
  });
  const dispatch = useDispatch();

  const openAddAccounts = useCallback(() => {
    dispatch(closeModal("MODAL_REQUEST_ACCOUNT"));
    dispatch(
      openModal("MODAL_ADD_ACCOUNTS", {
        currency,
        flow,
        onClose: () => selectAccount(),
      }),
    );
  }, [dispatch, currency, flow, selectAccount]);

  const addOrSelectAccount = () => {
    if (!currency) {
      return;
    }

    if (availableAccounts.length) {
      return (
        <>
          <FormContent>
            {/* FIXME: should display add account button only if allowAddAccount is true */}
            <AccountSelectorLabel>
              <span>{t("exchange.buy.coinify.selectAccount")}</span>
              <FakeLink fontSize={3} ff="Inter|SemiBold" onClick={openAddAccounts}>
                <PlusIcon size={10} />
                <Text style={{ marginLeft: 4 }}>{t("exchange.buy.coinify.addAccount")}</Text>
              </FakeLink>
            </AccountSelectorLabel>
            <SelectAccount
              accounts={availableAccounts}
              value={{ account, subAccount }}
              onChange={setAccount}
            />
          </FormContent>
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

                  confirmCb?.(account);
                }
              }}
              disabled={!account}
            >
              {t("exchange.buy.coinify.continue")}
            </ConfirmButton>
          </FormContent>
        </>
      );
    }

    // FIXME: should display add account button only if allowAddAccount is true
    return (
      <FormContent>
        <ConfirmButton primary onClick={openAddAccounts}>
          {t("exchange.buy.coinify.addAccount")}
        </ConfirmButton>
      </FormContent>
    );
  };

  return (
    <Container>
      <FormContainer>
        {currency ? <CurrencyDownStatusAlert currencies={[currency]} /> : null}
        <FormContent>
          <Label>{t("exchange.buy.coinify.selectCrypto")}</Label>
          <SelectCurrency
            onChange={setCurrency}
            currencies={allCurrencies}
            value={currency || undefined}
          />
        </FormContent>
        {addOrSelectAccount()}
      </FormContainer>
    </Container>
  );
};

export default SelectAccountAndCurrency;
