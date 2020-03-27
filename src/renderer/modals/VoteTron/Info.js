// @flow

import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { openModal, closeModal } from "~/renderer/actions/modals";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CheckBox from "~/renderer/components/CheckBox";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Popover from "~/renderer/components/Popover";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import votesImage from "~/renderer/images/votes.png";
import { colors } from "~/renderer/styles/theme";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function VoteTronInfoModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_VOTE_TRON", {
        parentAccount,
        account,
      }),
    );
  }, [parentAccount, account, dispatch, name]);

  const [showAgain, setShowAgain] = useState(false);

  function onClickShowAgain() {
    setShowAgain(!showAgain);
  }

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
                  <Text ff="Inter|SemiBold" fontSize={4} textAlign="center">
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
                    <Box
                      horizontal
                      alignSelf="center"
                      alignItems="center"
                      p={2}
                      justifyContent="center"
                      color="palette.text.shade50"
                    >
                      <Text ff="Inter|SemiBold" fontSize={2}>
                        {t("tron.manage.vote.steps.vote.info.message")}
                      </Text>

                      <Box ml={1}>
                        <InfoCircle size={12} />
                      </Box>
                    </Box>
                  </Popover>
                </Box>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <>
              <Box horizontal alignItems="center" onClick={onClickShowAgain} style={{ flex: 1 }}>
                <CheckBox isChecked={showAgain} />
                <Text
                  ff="Inter|SemiBold"
                  fontSize={4}
                  color="palette.text.shade50"
                  style={{ marginLeft: 8, overflowWrap: "break-word", flex: 1 }}
                >
                  {t("tron.manage.vote.steps.vote.footer.doNotShowAgain")}
                </Text>
              </Box>

              <Button primary onClick={onNext}>
                {t("tron.manage.vote.steps.vote.footer.next")}
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
