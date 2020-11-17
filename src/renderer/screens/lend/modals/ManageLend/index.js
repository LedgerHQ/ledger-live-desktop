// @flow

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { BigNumber } from "bignumber.js";
import { getAccountCapabilities, getEnablingOp } from "@ledgerhq/live-common/lib/compound/logic";
import type { Account, TokenAccount, Unit, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type {
  CompoundAccountSummary,
  CompoundAccountStatus,
} from "@ledgerhq/live-common/lib/compound/types";

import TrackPage from "~/renderer/analytics/TrackPage";
import { localeSelector } from "~/renderer/reducers/settings";

import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import ArrowRight from "~/renderer/icons/ArrowRight";
import Minus from "~/renderer/icons/Minus";
import Text from "~/renderer/components/Text";
import InfoBox from "~/renderer/components/InfoBox";

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background-color: ${p => p.theme.colors.palette.action.hover};
  color: ${p => p.theme.colors.palette.primary.main};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ManageButton = styled.button`
  min-height: 88px;
  padding: 16px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    border: 1px solid ${p => p.theme.colors.palette.primary.main};
  }

  ${p =>
    p.disabled
      ? css`
          pointer-events: none;
          cursor: auto;
          ${IconWrapper} {
            background-color: ${p.theme.colors.palette.action.active};
            color: ${p.theme.colors.palette.text.shade20};
          }
          ${Title} {
            color: ${p.theme.colors.palette.text.shade50};
          }
          ${Description} {
            color: ${p.theme.colors.palette.text.shade30};
          }
        `
      : `
      cursor: pointer;
  `};
`;

const InfoWrapper = styled(Box).attrs(() => ({
  vertical: true,
  flex: 1,
  ml: 3,
  textAlign: "start",
}))``;

const Title = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
}))``;

const Description = styled(Text).attrs(({ isPill }) => ({
  ff: isPill ? "Inter|SemiBold" : "Inter|Regular",
  fontSize: isPill ? 2 : 3,
  color: "palette.text.shade60",
}))`
  ${p =>
    p.isPill
      ? `
    text-transform: uppercase;
  `
      : ""}
`;

type Props = {
  name?: string,
  account: TokenAccount,
  parentAccount: ?Account,
  ...
} & CompoundAccountSummary;

const ManageModal = ({ name, account, parentAccount, totalSupplied, status, ...rest }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currency = getAccountCurrency(account);

  const onSelectAction = useCallback(
    (name: string, onClose: () => void, nextStep?: string, cta?: string) => {
      onClose();
      dispatch(
        openModal(name, {
          parentAccount,
          accountId: parentAccount?.id && account.parentId,
          account,
          currency,
          nextStep,
          cta,
        }),
      );
    },
    [dispatch, account, parentAccount, currency],
  );

  const locale = useSelector(localeSelector);
  const unit = getAccountUnit(account);

  const capabilities = getAccountCapabilities(account);
  if (!capabilities) return null;
  if (currency.type !== "TokenCurrency") return null;
  const { canSupply, canWithdraw } = capabilities;

  return (
    <Modal
      {...rest}
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          onClose={onClose}
          onBack={undefined}
          title={<Trans i18nKey="lend.manage.title" />}
          noScroll
          render={() => (
            <>
              <TrackPage category="Lend" name="Manage" eventProperties={{ currency }} />
              <Box>
                <Box mb={2}>
                  <Banner
                    onClose={onClose}
                    onSelectAction={onSelectAction}
                    unit={unit}
                    currency={currency}
                    locale={locale}
                    t={t}
                    capabilities={capabilities}
                    totalSupplied={totalSupplied}
                    account={account}
                    parentAccount={parentAccount}
                  />
                </Box>

                <ManageButton
                  disabled={!canSupply || status === "ENABLING"}
                  onClick={() => onSelectAction("MODAL_LEND_SUPPLY", onClose)}
                  event="Lend Deposit"
                  eventProperties={{ currency: currency.name }}
                >
                  <IconWrapper>
                    <ArrowRight size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="lend.manage.supply.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="lend.manage.supply.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!canWithdraw || status === "ENABLING"}
                  onClick={() => onSelectAction("MODAL_LEND_WITHDRAW_FLOW", onClose)}
                  event="Lend Withdraw"
                  eventProperties={{ currency: currency.name }}
                >
                  <IconWrapper>
                    <Minus size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="lend.manage.withdraw.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="lend.manage.withdraw.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
              </Box>
            </>
          )}
          renderFooter={undefined}
        />
      )}
    />
  );
};

const Banner = ({
  capabilities,
  locale,
  onClose,
  t,
  onSelectAction,
  unit,
  totalSupplied,
  currency,
  account,
  parentAccount,
}: {
  capabilities: {
    canSupply: boolean,
    canSupplyMax: Boolean,
    enabledAmount: BigNumber,
    enabledAmountIsUnlimited: boolean,
    canSupplyMax: boolean,
    status: CompoundAccountStatus,
  },
  locale: string,
  unit: Unit,
  currency: TokenCurrency,
  onSelectAction: (name: string, onClose: () => void, nextStep?: string, cta?: string) => void,
  onClose: () => void,
  t: any,
  totalSupplied: BigNumber,
  account: TokenAccount,
  parentAccount: ?Account,
}) => {
  const dispatch = useDispatch();
  const { enabledAmount, enabledAmountIsUnlimited, status, canSupplyMax } = capabilities;

  const label =
    (enabledAmountIsUnlimited && totalSupplied.eq(0)) || !canSupplyMax ? (
      <Trans i18nKey="lend.manage.enable.manageLimit" />
    ) : status === "ENABLING" ? (
      <Trans i18nKey="lend.manage.enable.viewDetails" />
    ) : (
      <Trans i18nKey="lend.manage.enable.approve" />
    );

  const text = !status ? (
    <Trans i18nKey="lend.manage.enable.notEnabled" />
  ) : enabledAmountIsUnlimited ? (
    <Trans i18nKey="lend.manage.enable.infoNoLimit" />
  ) : !!status && enabledAmount.gt(0) && canSupplyMax ? (
    <Trans
      i18nKey="lend.manage.enable.info"
      values={{
        amount: formatCurrencyUnit(unit, enabledAmount, {
          locale,
          showAllDigits: false,
          disableRounding: false,
          showCode: true,
        }),
      }}
    >
      <b></b>
    </Trans>
  ) : enabledAmount.gt(0) ? (
    <Trans
      i18nKey="lend.manage.enable.approvedWithLimit"
      values={{
        amount: formatCurrencyUnit(unit, enabledAmount, {
          locale,
          showAllDigits: false,
          disableRounding: false,
          showCode: true,
        }),
      }}
    >
      <b></b>
    </Trans>
  ) : status === "ENABLING" ? (
    <Trans i18nKey="lend.manage.enable.enabling" />
  ) : !!status && !canSupplyMax ? (
    <Trans i18nKey="lend.manage.enable.notEnoughApproved" />
  ) : null;

  const action = useCallback(() => {
    if (status === "ENABLING") {
      const op = getEnablingOp(account);
      if (!op) return;
      return dispatch(
        openModal("MODAL_OPERATION_DETAILS", {
          operationId: op.id,
          accountId: account.id,
          parentId: parentAccount?.id,
        }),
      );
    }

    return onSelectAction(
      "MODAL_LEND_ENABLE_FLOW",
      onClose,
      undefined,
      t("lend.enable.steps.selectAccount.cta"),
    );
  }, [status, onClose, onSelectAction, t, dispatch, account, parentAccount]);

  return (
    <InfoBox onLearnMore={action} learnMoreLabel={label}>
      {text}
    </InfoBox>
  );
};

export default ManageModal;
