// @flow

import React, { useCallback, useState, useMemo } from "react";
import { useDispatch, connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useTranslation, Trans } from "react-i18next";

import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";

import type {
  AccountLike,
  TokenAccount,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import type { CompoundAccountStatus } from "@ledgerhq/live-common/lib/compound/types";
import { BigNumber } from "bignumber.js";

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
import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";
import ToolTip from "~/renderer/components/Tooltip";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";

type Capabilities = {
  enabledAmount: BigNumber,
  enabledAmountIsUnlimited: boolean,
  canSupply: boolean,
  canSupplyMax: boolean,
  canWithdraw: boolean,
  status: CompoundAccountStatus,
};

export function AccountOption({
  account,
  isValue,
  disabled,
}: {
  account: TokenAccount & {
    capabilities: ?Capabilities,
  },
  isValue?: boolean,
  disabled?: boolean,
}) {
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const { capabilities, parentAccount } = account;
  const name = getAccountName(parentAccount || account);
  const isEnabled =
    capabilities &&
    ((capabilities.enabledAmount && capabilities.enabledAmount.gt(0)) ||
      capabilities.enabledAmountIsUnlimited);

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
      <Box color="warning" style={{ width: 16 }}>
        {isEnabled && (
          <ToolTip content={<Trans i18nKey="lend.enable.steps.selectAccount.alreadyEnabled" />}>
            <ExclamationCircle size={16} />
          </ToolTip>
        )}
      </Box>
    </Box>
  );
}

export const renderValue = ({
  data,
}: {
  data: TokenAccount & {
    capabilities: ?Capabilities,
  },
}) => (data ? <AccountOption account={data} isValue /> : null);

export const renderOption = ({
  data,
}: {
  data: TokenAccount & {
    capabilities: ?Capabilities,
  },
}) => (data ? <AccountOption account={data} /> : null);

export const getOptionValue = (option?: { id: string }) => option && option.id;

type Props = {
  name?: string,
  currency: CryptoCurrency | TokenCurrency,
  accounts: AccountLike[],
  nextStep: string,
  cta: React$Node,
  ...
};

const SelectAccountStepModal = ({ name, currency, accounts, nextStep, cta, ...rest }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const formattedAccounts = useMemo(
    () =>
      accounts.map(a => ({
        ...a,
        capabilities: a.type === "TokenAccount" && getAccountCapabilities(a),
      })),
    [accounts],
  );

  const [account, setAccount] = useState(formattedAccounts[0]);

  const onClose = useCallback(() => {
    dispatch(closeModal(name));
  }, [name, dispatch]);

  const onNext = useCallback(() => {
    const { capabilities } = account;
    const isEnabled =
      capabilities &&
      ((capabilities.enabledAmount && capabilities.enabledAmount.gt(0)) ||
        capabilities.enabledAmountIsUnlimited);
    const parentAccount = account.parentAccount;
    onClose();
    dispatch(
      openModal(isEnabled ? "MODAL_LEND_SUPPLY" : nextStep, {
        ...rest,
        currency,
        account,
        accountId: account.parentId ? account.parentId : null,
        parentAccount,
      }),
    );
  }, [onClose, account, dispatch, nextStep, rest, currency]);

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
                options={formattedAccounts}
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
                {cta}
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
