// @flow

import React, { useCallback, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useTranslation } from "react-i18next";

import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";

import type { AccountLike, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";

import { openModal, closeModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { subAccountByCurrencyOrderedSelector } from "~/renderer/reducers/accounts";
import Button from "~/renderer/components/Button";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import FormattedVal from "~/renderer/components/FormattedVal";

export function AccountOption({
  account,
  isValue,
  disabled,
}: {
  account: AccountLike,
  isValue?: boolean,
  disabled?: boolean,
}) {
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const name = getAccountName(account);

  // @TODO show enable or not enabled ticker once info is available on account data

  return (
    <Box grow horizontal alignItems="center" flow={2} style={{ opacity: disabled ? 0.2 : 1 }}>
      <CryptoCurrencyIcon currency={currency} size={16} />
      <div style={{ flex: 1 }}>
        <Ellipsis ff="Inter|SemiBold" fontSize={4}>
          {name}
        </Ellipsis>
      </div>
      <Box>
        <FormattedVal color="palette.text.shade60" val={account.balance} unit={unit} showCode />
      </Box>
    </Box>
  );
}

export const renderValue = ({ data }: { data: AccountLike }) =>
  data ? <AccountOption account={data} isValue /> : null;

export const renderOption = ({ data }: { data: AccountLike }) => {
  console.warn(data);
  return data ? <AccountOption account={data} /> : null;
};

export const getOptionValue = (option?: { id: string }) => option && option.id;

type Props = {
  name?: string,
  currency: CryptoCurrency | TokenCurrency,
  accounts: AccountLike[],
  nextStep: string,
  ...
} & CompoundAccountSummary;

const SelectAccountStepModal = ({ name, currency, accounts, nextStep, ...rest }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [account, setAccount] = useState(accounts[0]);

  const onClose = useCallback(() => {
    dispatch(closeModal(name));
  }, [name, dispatch]);

  const onNext = useCallback(() => {
    onClose();
    dispatch(
      openModal(nextStep, {
        ...rest,
        account,
        accountId: account.parentId ? account.parentId : null,
      }),
    );
  }, [onClose, dispatch, nextStep, rest, account]);

  const onChangeAccount = useCallback(
    a => {
      setAccount(a);
    },
    [setAccount],
  );

  if (!accounts || accounts.length <= 0) return null;

  return (
    <Modal
      {...rest}
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          onClose={onClose}
          onBack={undefined}
          title={t("lend.enable.steps.selectAccount.title")}
          noScroll
          render={() => (
            <Box flow={1}>
              <Label>{t("lend.enable.steps.selectAccount.selectLabel")}</Label>
              <Select
                value={account}
                options={accounts}
                getOptionValue={getOptionValue}
                renderValue={renderValue}
                renderOption={renderOption}
                filterOption={false}
                isSearchable={false}
                placeholder={t("common.selectAccount")}
                noOptionsMessage={({ inputValue }) =>
                  t("common.selectAccountNoOption", { accountName: inputValue })
                }
                onChange={onChangeAccount}
              />
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal flex="1 1 0%">
              <Box grow />
              <Button primary disabled={!account} onClick={onNext}>
                {t("lend.enable.steps.selectAccount.cta")}
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  accounts: subAccountByCurrencyOrderedSelector,
});

const m: React$ComponentType<Props> = connect(mapStateToProps)(SelectAccountStepModal);

export default m;
