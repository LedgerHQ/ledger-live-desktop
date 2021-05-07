// @flow

import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import type { TFunction } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { Trans, withTranslation } from "react-i18next";
import type { Account, SignedOperation } from "@ledgerhq/live-common/lib/types";
import { closeModal, openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";
import Select from "../../components/Select";
import SelectAccountAndCurrency from "./SelectAccountAndCurrency";

type OwnProps = {|
  onClose: () => void,
  params: {
    currencies?: string[],
    allowAddAccount?: boolean,
    onResult: (signedOperation: SignedOperation) => void,
    onCancel: (reason: any) => void,
  },
|};

type StateProps = {|
  t: TFunction,
  accounts: Account[],
  closeModal: string => void,
  openModal: (string, any) => void,
|};

type Props = {|
  ...OwnProps,
  ...StateProps,
|};

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
});

const mapDispatchToProps = {
  closeModal,
  openModal,
};

const Body = ({ t, openModal, closeModal, onClose, params }: Props) => {
  const handleCloseModal = useCallback(() => {
    closeModal("MODAL_REQUEST_ACCOUNT");
  }, [closeModal]);

  const selectAccount = useCallback((account, parentAccount) => {
    params.onResult(account, parentAccount);
    closeModal("MODAL_REQUEST_ACCOUNT");
  }, []);

  return (
    <>
      <SelectAccountAndCurrency selectAccount={selectAccount} />
    </>
  );
};

const m: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default m;
