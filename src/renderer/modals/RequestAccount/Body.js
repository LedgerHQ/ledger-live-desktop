// @flow

import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import type { TFunction } from "react-i18next";
import { createStructuredSelector } from "reselect";
import { withTranslation } from "react-i18next";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies/sortByMarketcap";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import SelectAccountAndCurrency from "~/renderer/components/SelectAccountAndCurrency";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { closeModal, openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { ModalBody } from "~/renderer/components/Modal";

type OwnProps = {|
  onClose: () => void,
  params: {
    currencies?: string[],
    allowAddAccount?: boolean,
    onResult: (account: AccountLike, parentAccount?: Account | null) => void,
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
  const { allowAddAccount, currencies: allowedCurrencies } = params;

  const selectAccount = useCallback(
    (account, parentAccount) => {
      params.onResult(account, parentAccount);
      closeModal("MODAL_REQUEST_ACCOUNT");
    },
    [params, closeModal],
  );

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

  return (
    <ModalBody
      onClose={onClose}
      title={t("platform.flows.requestAccount.title")}
      noScroll={true}
      render={() => (
        <SelectAccountAndCurrency
          selectAccount={selectAccount}
          allowedCurrencies={allowedCurrencies}
          allowAddAccount={allowAddAccount}
          allCurrencies={allCurrencies}
        />
      )}
    />
  );
};

const m: React$ComponentType<OwnProps> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Body);

export default m;
