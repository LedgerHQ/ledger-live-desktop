// @flow

import React, { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Trans } from "react-i18next";
import type { Account } from "@ledgerhq/live-common/lib/types";

import { usePolkadotPreloadData } from "@ledgerhq/live-common/lib/families/polkadot/react";
import {
  canNominate,
  canBond,
  canUnbond,
  hasPendingOperationType,
} from "@ledgerhq/live-common/lib/families/polkadot/logic";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";

import BondIcon from "~/renderer/icons/LinkIcon";
import UnbondIcon from "~/renderer/icons/Undelegate";
import NominateIcon from "~/renderer/icons/Vote";
import ChillIcon from "~/renderer/icons/VoteNay";
import WithdrawUnbondedIcon from "~/renderer/icons/Coins";

import Text from "~/renderer/components/Text";

import ElectionStatusWarning from "./ElectionStatusWarning";

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
  account: Account,
  ...
};

const ManageModal = ({ name, account, ...rest }: Props) => {
  const dispatch = useDispatch();

  const { staking } = usePolkadotPreloadData();

  const { polkadotResources } = account;

  invariant(polkadotResources, "polkadot account expected");

  const { unlockedBalance, nominations } = polkadotResources;

  const onSelectAction = useCallback(
    (onClose, name, params = {}) => {
      onClose();
      dispatch(
        openModal(name, {
          account,
          ...params,
        }),
      );
    },
    [dispatch, account],
  );

  const electionOpen = staking?.electionClosed !== undefined ? !staking?.electionClosed : false;
  const hasUnlockedBalance = unlockedBalance && unlockedBalance.gt(0);
  const hasPendingWithdrawUnbondedOperation = hasPendingOperationType(account, "WITHDRAW_UNBONDED");

  const nominationEnabled = !electionOpen && canNominate(account);
  const chillEnabled = !electionOpen && canNominate(account) && nominations?.length;
  const bondingEnabled = !electionOpen && canBond(account);
  const unbondingEnabled = !electionOpen && canUnbond(account);
  const withdrawEnabled =
    !electionOpen && hasUnlockedBalance && !hasPendingWithdrawUnbondedOperation;

  return (
    <Modal
      {...rest}
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          onClose={onClose}
          onBack={undefined}
          title={<Trans i18nKey="polkadot.manage.title" />}
          noScroll
          render={() => (
            <>
              <Box>
                {electionOpen ? <ElectionStatusWarning /> : null}
                <ManageButton
                  disabled={!bondingEnabled}
                  onClick={() => onSelectAction(onClose, "MODAL_POLKADOT_BOND")}
                >
                  <IconWrapper>
                    <BondIcon size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="polkadot.manage.bond.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="polkadot.manage.bond.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!unbondingEnabled}
                  onClick={() => onSelectAction(onClose, "MODAL_POLKADOT_UNBOND")}
                >
                  <IconWrapper>
                    <UnbondIcon size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="polkadot.manage.unbond.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="polkadot.manage.unbond.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!withdrawEnabled}
                  onClick={() =>
                    onSelectAction(onClose, "MODAL_POLKADOT_SIMPLE_OPERATION", {
                      mode: "withdrawUnbonded",
                    })
                  }
                >
                  <IconWrapper>
                    <WithdrawUnbondedIcon size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="polkadot.manage.withdrawUnbonded.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="polkadot.manage.withdrawUnbonded.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!nominationEnabled}
                  onClick={() => onSelectAction(onClose, "MODAL_POLKADOT_NOMINATE")}
                >
                  <IconWrapper>
                    <NominateIcon size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="polkadot.manage.nominate.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="polkadot.manage.nominate.description" />
                    </Description>
                  </InfoWrapper>
                </ManageButton>
                <ManageButton
                  disabled={!chillEnabled}
                  onClick={() =>
                    onSelectAction(onClose, "MODAL_POLKADOT_SIMPLE_OPERATION", {
                      mode: "chill",
                    })
                  }
                >
                  <IconWrapper>
                    <ChillIcon size={16} />
                  </IconWrapper>
                  <InfoWrapper>
                    <Title>
                      <Trans i18nKey="polkadot.manage.chill.title" />
                    </Title>
                    <Description>
                      <Trans i18nKey="polkadot.manage.chill.description" />
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
