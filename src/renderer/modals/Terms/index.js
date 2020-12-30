// @flow
import React, { useState, useCallback } from "react";
import { Trans } from "react-i18next";

import { useDispatch } from "react-redux";

import { useTerms, url, acceptTerms } from "~/renderer/terms";
import { urls } from "~/config/urls";
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
  const onSwitchAccept = useCallback(() => setAccepted(a => !a), []);

  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const onSwitchAcceptPrivacyPolicy = useCallback(() => setAcceptedPrivacyPolicy(a => !a), []);

  const onClickClose = useCallback(() => {
    dispatch(closeModal("MODAL_TERMS"));
  }, [dispatch]);

  const onClick = useCallback(() => {
    acceptTerms();
    onClickClose();
  }, [onClickClose]);

  const openTerms = useCallback(() => openURL(urls.terms), []);
  const openPrivacyPolicy = useCallback(() => openURL(urls.privacyPolicy), []);
  const onClickFakeLink = useCallback(() => openURL(url), []);

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

                <LinkWithExternalIcon onClick={onClickFakeLink}>
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
                >
                  <CheckBox
                    isChecked={accepted}
                    onChange={onSwitchAccept}
                    id="modal-terms-checkbox"
                  />
                  <Text ff="Inter|SemiBold" fontSize={4} style={{ marginLeft: 8, flex: 1 }}>
                    <Trans i18nKey="Terms.switchLabelTerms">
                      <Text onClick={onSwitchAccept} />
                      <Text onClick={openTerms} color="wallet" />
                    </Trans>
                  </Text>
                </Box>
                <Box
                  horizontal
                  my={2}
                  style={{ width: "100%" }}
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <CheckBox
                    isChecked={acceptedPrivacyPolicy}
                    onChange={onSwitchAcceptPrivacyPolicy}
                    id="modal-terms-privacy-policy"
                  />
                  <Text ff="Inter|SemiBold" fontSize={4} style={{ marginLeft: 8, flex: 1 }}>
                    <Trans i18nKey="Terms.switchLabelPrivacyPolicy">
                      <Text onClick={onSwitchAcceptPrivacyPolicy} />
                      <Text onClick={openPrivacyPolicy} color="wallet" />
                    </Trans>
                  </Text>
                </Box>
                <Button
                  style={{ marginTop: 24, paddingRight: 45, paddingLeft: 45 }}
                  onClick={onClick}
                  primary
                  disabled={!accepted || !acceptedPrivacyPolicy}
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
