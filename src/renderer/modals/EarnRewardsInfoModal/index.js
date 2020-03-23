// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal, closeModal } from "~/renderer/actions/modals";
import Check from "~/renderer/icons/CheckFull";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

import Rewards from "~/renderer/images/rewards.png";
import Modal, { ModalBody } from "~/renderer/components/Modal/index";

const RewardImg = styled.img.attrs(() => ({ src: Rewards }))`
  width: 182px;
  height: auto;
`;

const Row = styled(Box).attrs(p => ({
  horizontal: true,
  justifyContent: "flex-start",
  alignItems: "center",
  color: p.theme.colors.greenPill,
}))`
  margin-bottom: 6px;
  & > :first-child {
    margin-right: 8px;
  }
`;

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

const EarnRewardsInfoModal = ({ name, account, parentAccount }: Props) => {
  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_FREEZE", {
        parentAccount,
        account,
      }),
    );
  }, [parentAccount, account, dispatch, name]);

  return (
    <Modal
      name={name}
      centered
      render={({ onClose, data }) => (
        <ModalBody
          title={<Trans i18nKey="delegation.earnRewards" />}
          onClose={onClose}
          noScroll
          render={onClose => (
            <Box flow={4} mx={4}>
              <TrackPage category="Delegation Flow" name="Step Starter" />
              <Box flow={1} alignItems="center">
                <Box mb={4}>
                  <RewardImg />
                </Box>
                <Box mb={4}>
                  <Text
                    ff="Inter|Regular"
                    fontSize={14}
                    textAlign="center"
                    color="palette.text.shade80"
                    style={{ lineHeight: 1.57 }}
                  >
                    <Trans i18nKey="tron.voting.flow.steps.starter.description" />
                  </Text>
                </Box>
                <Box>
                  <Row>
                    <Check size={16} />
                    <Text
                      ff="Inter|Bold"
                      style={{ lineHeight: 1.57 }}
                      color="palette.text.shade100"
                      fontSize={14}
                    >
                      <Trans i18nKey="tron.voting.flow.steps.starter.bullet.delegate" />
                    </Text>
                  </Row>
                  <Row>
                    <Check size={16} />
                    <Text
                      ff="Inter|Bold"
                      style={{ lineHeight: 1.57 }}
                      color="palette.text.shade100"
                      fontSize={14}
                    >
                      <Trans i18nKey="tron.voting.flow.steps.starter.bullet.access" />
                    </Text>
                  </Row>
                  <Row>
                    <Check size={16} />
                    <Text
                      ff="Inter|Bold"
                      style={{ lineHeight: 1.57 }}
                      color="palette.text.shade100"
                      fontSize={14}
                    >
                      <Trans i18nKey="tron.voting.flow.steps.starter.bullet.ledger" />
                    </Text>
                  </Row>
                </Box>
                <Box my={4}>
                  <LinkWithExternalIcon
                    label={<Trans i18nKey="delegation.howItWorks" />}
                    onClick={() => openURL(urls.delegation)}
                  />
                </Box>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <>
              <Button secondary onClick={onClose}>
                <Trans i18nKey="common.cancel" />
              </Button>
              <Button primary onClick={onNext}>
                <Trans i18nKey="common.continue" />
              </Button>
            </>
          )}
        />
      )}
    />
  );
};

export default EarnRewardsInfoModal;
