// @flow
import React, { useState, useCallback } from "react";
import { Trans } from "react-i18next";

import { useDispatch } from "react-redux";

import { useTerms, url, acceptTerms } from "~/renderer/terms";
import { openURL } from "~/renderer/linking";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Spinner from "~/renderer/components/Spinner";
import Text from "~/renderer/components/Text";
import CheckBox from "~/renderer/components/CheckBox";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import TranslatedError from "~/renderer/components/TranslatedError";
import TrackPage from "~/renderer/analytics/TrackPage";
import Markdown, { Terms } from "~/renderer/components/Markdown";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import { closeModal } from "~/renderer/actions/modals";
import ChevronRight from "~/renderer/icons/ChevronRight";

const TermsModal = ({ showClose = false }: { showClose?: boolean }) => {
  const dispatch = useDispatch();

  const [markdown, error] = useTerms();
  const [accepted, setAccepted] = useState(false);
  const onSwitchAccept = useCallback(() => setAccepted(!accepted), [accepted]);

  const [acceptedLoss, setAcceptedLoss] = useState(false);
  const onSwitchAcceptLoss = useCallback(() => setAcceptedLoss(!acceptedLoss), [acceptedLoss]);

  const onClickClose = useCallback(() => {
    dispatch(closeModal("MODAL_TERMS"));
  }, [dispatch]);

  const onClick = useCallback(() => {
    acceptTerms();
    onClickClose();
  }, [onClickClose]);

  return (
    <Modal name="MODAL_TERMS" preventBackdropClick centered width={700}>
      <ModalBody
        title={<Trans i18nKey="Terms.title" />}
        render={() => (
          <>
            <TrackPage category="Modal" name="Terms" />

            {markdown ? (
              <Terms px={5} pb={8}>
                <Markdown>{markdown}</Markdown>
              </Terms>
            ) : error ? (
              <Box grow alignItems="center" justifyContent="space-around">
                <Text ff="Inter|SemiBold" fontSize={3}>
                  <TranslatedError error={error} />
                </Text>

                <LinkWithExternalIcon onClick={() => openURL(url)}>
                  <Trans i18nKey="Terms.read" />
                </LinkWithExternalIcon>
              </Box>
            ) : (
              <Box horizontal alignItems="center">
                <Spinner
                  size={32}
                  style={{
                    margin: "auto",
                  }}
                />
              </Box>
            )}
          </>
        )}
        modalFooterStyle={{ justifyContent: "stretch" }}
        renderFooter={() => (
          <Box
            style={{ position: "relative", width: "100%", height: "auto" }}
            grow
            justifyContent={showClose ? "flex-end" : "space-between"}
            px={5}
            alignItems="center"
          >
            {showClose ? (
              <Button primary onClick={onClickClose}>
                <Trans i18nKey="common.close" />
              </Button>
            ) : (
              <>
                <Box
                  horizontal
                  my={2}
                  style={{ width: "100%" }}
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  onClick={onSwitchAcceptLoss}
                >
                  <CheckBox
                    isChecked={acceptedLoss}
                    onChange={onSwitchAcceptLoss}
                    id="modal-terms-checkbox-loss"
                  />
                  <Text
                    ff="Inter|SemiBold"
                    color="alertRed"
                    fontSize={4}
                    style={{ marginLeft: 8, flex: 1 }}
                  >
                    <Trans i18nKey="Terms.switchLabelLoss" />
                  </Text>
                </Box>
                <Box
                  horizontal
                  my={2}
                  style={{ width: "100%" }}
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  onClick={onSwitchAccept}
                >
                  <CheckBox
                    isChecked={accepted}
                    onChange={onSwitchAccept}
                    id="modal-terms-checkbox"
                  />
                  <Text ff="Inter|SemiBold" fontSize={4} style={{ marginLeft: 8, flex: 1 }}>
                    <Trans i18nKey="Terms.switchLabel">
                      <Text onClick={() => openURL(url)} color="wallet" />
                    </Trans>
                  </Text>
                </Box>
                <Button
                  style={{ marginTop: 24, paddingRight: 45, paddingLeft: 45 }}
                  onClick={onClick}
                  primary
                  disabled={!accepted || !acceptedLoss}
                  id="modal-confirm-button"
                >
                  <Trans i18nKey="Terms.cta" />
                  <Box ml={2}>
                    <ChevronRight size={13} />
                  </Box>
                </Button>
              </>
            )}
          </Box>
        )}
      />
    </Modal>
  );
};

export default TermsModal;
