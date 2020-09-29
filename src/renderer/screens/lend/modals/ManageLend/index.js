// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Trans } from "react-i18next";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";

import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Plus from "~/renderer/icons/Plus";
import ArrowRight from "~/renderer/icons/ArrowRight";
import Minus from "~/renderer/icons/Minus";
import Text from "~/renderer/components/Text";

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background-color: ${p => p.theme.colors.palette.action.hover};
  color: ${p => p.theme.colors.palette.primary.main};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${p => p.theme.space[2]}px;
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
  align-items: flex-start;

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
  account: AccountLike,
  parentAccount: ?Account,
  ...
} & CompoundAccountSummary;

const ManageModal = ({ name, account, parentAccount, ...rest }: Props) => {
  const dispatch = useDispatch();

  const currency = getAccountCurrency(account);

  const onSelectAction = useCallback(
    (name: string, onClose: () => void, nextStep?: string) => {
      onClose();
      dispatch(
        openModal(name, {
          parentAccount,
          account,
          currency,
          nextStep,
        }),
      );
    },
    [dispatch, account, parentAccount, currency],
  );

  // @TODO add in enable/disable conditions for lending
  const canEnable = true;
  const canSupply = true;
  const canWithdraw = true;

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
              <Box>
                <ManageButton
                  disabled={!canEnable}
                  onClick={() => onSelectAction("MODAL_LEND_ENABLE_INFO", onClose)}
                >
                  <IconWrapper>
                    <Plus size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="lend.manage.enable.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="lend.manage.enable.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!canSupply}
                  onClick={() =>
                    onSelectAction("MODAL_LEND_SELECT_ACCOUNT", onClose, "MODAL_LEND_SUPPLY")
                  }
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
                  disabled={!canWithdraw}
                  onClick={() => onSelectAction("MODAL_LEND_WITHDRAW", onClose)}
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

export default ManageModal;
