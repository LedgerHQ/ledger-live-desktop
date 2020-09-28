// @flow

import React, { useCallback, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import type { AccountLike, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";

import { openModal, closeModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { RawSelectAccount } from "~/renderer/components/SelectAccount";
import { subAccountByCurrencyOrderedSelector } from "~/renderer/reducers/accounts";
import Button from "~/renderer/components/Button";
import Label from "~/renderer/components/Label";

type Props = {
  name?: string,
  currency: CryptoCurrency | TokenCurrency,
  accounts: AccountLike[],
  ...
} & CompoundAccountSummary;

const SelectAccountStepModal = ({ name, currency, accounts, ...rest }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [account, setAccount] = useState(accounts[0]);

  const onClose = useCallback(() => {
    dispatch(closeModal(name));
  }, [name, dispatch]);

  const onNext = useCallback(() => {
    onClose();
    // dispatch(openModal(name, { account }));
  }, [dispatch, account, onClose]);

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
              <RawSelectAccount
                // $FlowFixMe
                accounts={accounts}
                autoFocus={true}
                onChange={onChangeAccount}
                value={account}
                t={t}
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
