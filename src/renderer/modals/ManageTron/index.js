// @flow

import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { MIN_TRANSACTION_AMOUNT } from "@ledgerhq/live-common/lib/families/tron/react";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Freeze from "~/renderer/icons/Freeze";
import Vote from "~/renderer/icons/Vote";
import Unfreeze from "~/renderer/icons/Unfreeze";
import Text from "~/renderer/components/Text";
import moment from "moment";
import Clock from "~/renderer/icons/Clock";

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

const TimerWrapper = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  ff: "Inter|Medium",
  fontSize: 3,
  color: "palette.text.shade50",
  bg: "palette.action.active",
  borderRadius: 4,
  p: 1,
  ml: 4,
}))`
  align-self: center;

  ${Description} {
    margin-left: 5px;
  }
`;

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
  ...
};

const ManageModal = ({ name, account, parentAccount, ...rest }: Props) => {
  const dispatch = useDispatch();
  const mainAccount = getMainAccount(account, parentAccount);

  const { spendableBalance, tronResources } = mainAccount;

  const { tronPower, frozen, votes } = tronResources || {};
  const { bandwidth, energy } = frozen || {};

  const canFreeze = spendableBalance && spendableBalance.gte(MIN_TRANSACTION_AMOUNT);

  const timeToUnfreezeBandwidth =
    bandwidth && bandwidth.expiredAt ? +bandwidth.expiredAt : Infinity;
  const timeToUnfreezeEnergy = energy && energy.expiredAt ? +energy.expiredAt : Infinity;

  const effectiveTimeToUnfreeze = Math.min(timeToUnfreezeBandwidth, timeToUnfreezeEnergy);

  const canUnfreeze =
    frozen &&
    BigNumber((bandwidth && bandwidth.amount) || 0)
      .plus((energy && energy.amount) || 0)
      .gte(MIN_TRANSACTION_AMOUNT) &&
    effectiveTimeToUnfreeze < Date.now();

  const formattedTimeToUnfreeze = useMemo(() => moment(effectiveTimeToUnfreeze).fromNow(), [
    effectiveTimeToUnfreeze,
  ]);

  const canVote = tronPower > 0;

  const onSelectAction = useCallback(
    (name, onClose) => {
      onClose();
      dispatch(
        openModal(name, {
          parentAccount,
          account,
        }),
      );
    },
    [dispatch, account, parentAccount],
  );

  return (
    <Modal
      {...rest}
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          onClose={onClose}
          onBack={undefined}
          title={<Trans i18nKey="tron.manage.title" />}
          noScroll
          render={() => (
            <>
              <Box>
                <ManageButton
                  disabled={!canFreeze}
                  onClick={() => onSelectAction("MODAL_FREEZE", onClose)}
                >
                  <IconWrapper>
                    <Freeze size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="tron.manage.freeze.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="tron.manage.freeze.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!canUnfreeze}
                  onClick={() => onSelectAction("MODAL_UNFREEZE", onClose)}
                >
                  <IconWrapper>
                    <Unfreeze size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="tron.manage.unfreeze.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="tron.manage.unfreeze.description" />
                    </Description>
                  </InfoWrapper>
                  {!canUnfreeze && (
                    <TimerWrapper>
                      <Clock size={12} />
                      <Description isPill>{formattedTimeToUnfreeze}</Description>
                    </TimerWrapper>
                  )}
                </ManageButton>
                <ManageButton
                  disabled={!canVote}
                  onClick={() =>
                    onSelectAction(
                      votes && votes.length > 0 ? "MODAL_VOTE_TRON" : "MODAL_VOTE_TRON_INFO",
                      onClose,
                    )
                  }
                >
                  <IconWrapper>
                    <Vote size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="tron.manage.vote.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="tron.manage.vote.description" />
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
