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

const TermsModal = () => {
  const dispatch = useDispatch();

  const [markdown, error] = useTerms();
  const [accepted, setAccepted] = useState(false);
  const onSwitchAccept = useCallback(() => setAccepted(!accepted), [accepted]);

  const onClick = useCallback(() => {
    acceptTerms();
    dispatch(closeModal("MODAL_TERMS"));
  }, [dispatch]);

  return (
    <Modal name="MODAL_TERMS" preventBackdropClick centered>
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
            style={{ position: "relative" }}
            grow
            horizontal
            justifyContent="space-between"
            alignItems="center"
          >
            <Box style={{ width: "50%" }} horizontal alignItems="center" onClick={onSwitchAccept}>
              <CheckBox isChecked={accepted} data-automation-id="terms-checkbox" />
              <Text ff="Inter|SemiBold" fontSize={4} style={{ marginLeft: 8, flex: 1 }}>
                <Trans i18nKey="Terms.switchLabel" />
              </Text>
            </Box>
            <Button
              style={{ position: "absolute", right: 0 /* flex and <Box> hell */ }}
              onClick={onClick}
              primary
              disabled={!accepted}
              data-automation-id="terms-confirm-button"
            >
              <Trans i18nKey="common.confirm" />
            </Button>
          </Box>
        )}
      />
    </Modal>
  );
};

export default TermsModal;
