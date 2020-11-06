// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Trans } from "react-i18next";
import type { Account } from "@ledgerhq/live-common/lib/types";

import { canNominate, canBond, canUnbond } from "@ledgerhq/live-common/lib/families/polkadot/logic";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Freeze from "~/renderer/icons/Freeze";
import Vote from "~/renderer/icons/Vote";
import Unfreeze from "~/renderer/icons/Unfreeze";
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
  account: Account,
  ...
};

const ManageModal = ({ name, account, ...rest }: Props) => {
  const dispatch = useDispatch();

  const onSelectAction = useCallback(
    (name, onClose) => {
      onClose();
      dispatch(
        openModal(name, {
          account,
        }),
      );
    },
    [dispatch, account],
  );

  const nominationEnabled = canNominate(account);
  const bondingEnabled = canBond(account);
  const unbondingEnabled = canUnbond(account);

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
                <ManageButton
                  disabled={!bondingEnabled}
                  onClick={() => onSelectAction("MODAL_POLKADOT_BOND", onClose)}
                >
                  <IconWrapper>
                    <Freeze size={16} />
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
                  onClick={() => onSelectAction("MODAL_POLKADOT_UNBOND", onClose)}
                >
                  <IconWrapper>
                    <Unfreeze size={16} />
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
                  disabled={!nominationEnabled}
                  onClick={() => onSelectAction("MODAL_POLKADOT_NOMINATE", onClose)}
                >
                  <IconWrapper>
                    <Vote size={16} />
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
