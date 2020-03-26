// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { openModal, closeModal } from "~/renderer/actions/modals";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Popover from "~/renderer/components/Popover";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import votesImage from "~/renderer/images/votes.png";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function CastVotesModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_VALIDATORS", {
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
          title={t("tron.manage.vote.steps.vote.title")}
          onClose={onClose}
          noScroll
          render={onClose => (
            <Box flow={4} mx={4}>
              <TrackPage category="Voting Flow" name="Step Vote" />

              <Box flow={1} alignItems="center">
                <Box mb={4}>
                  <Img src={votesImage} />
                </Box>

                <Box mb={4}>
                  <Text ff="Inter|SemiBold" fontSize={16} textAlign="center">
                    {t("tron.manage.vote.steps.vote.description")}
                  </Text>

                  <Popover
                    position="right"
                    content={
                      <Box vertical px={2}>
                        <Box vertical alignItems="start" justifyContent="start" my={2}>
                          <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                            {t("tron.manage.vote.steps.vote.info.superRepresentative.title")}
                          </Text>

                          <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                            {t("tron.manage.vote.steps.vote.info.superRepresentative.description")}
                          </Text>
                        </Box>

                        <Box vertical alignItems="start" justifyContent="start" my={2}>
                          <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
                            {t("tron.manage.vote.steps.vote.info.candidates.title")}
                          </Text>

                          <Text fontSize={3} textAlign="left" color="palette.text.shade80">
                            {t("tron.manage.vote.steps.vote.info.candidates.description")}
                          </Text>
                        </Box>
                      </Box>
                    }
                  >
                    <Box horizontal alignItems="center" p={2} justifyContent="center">
                      <Text ff="Inter|Medium" fontSize={4}>
                        {t("tron.manage.vote.steps.vote.info.message")}
                      </Text>
                      <Box ml={1}>
                        <InfoCircle size={16} />
                      </Box>
                    </Box>
                  </Popover>
                </Box>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <>
              <Button primary onClick={onNext}>
                {t("tron.manage.vote.steps.vote.nextButton")}
              </Button>
            </>
          )}
        />
      )}
    />
  );
}

const Img = styled.img`
  width: 182px;
  height: auto;
`;

const IntoTitle = styled(Text)`
  margin-right: ${p => p.theme.space[1]}px;
`;
