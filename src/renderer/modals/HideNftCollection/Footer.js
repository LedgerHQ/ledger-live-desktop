// @flow

import React, { useCallback } from "react";
import Button from "~/renderer/components/Button";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import { useDispatch } from "react-redux";
import { hideNftCollection } from "~/renderer/actions/settings";

const Footer = ({ onClose, collectionId }: { onClose: () => void, collectionId: string }) => {
  const dispatch = useDispatch();
  const confirmHideNftCollection = useCallback(
    collectionId => {
      dispatch(hideNftCollection(collectionId));
    },
    [dispatch],
  );

  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
      <Button onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button
        data-test-id="modal-confirm-button"
        onClick={() => {
          confirmHideNftCollection(collectionId);
          onClose();
        }}
        primary
      >
        <Trans i18nKey="hideNftCollection.hideCTA" />
      </Button>
    </Box>
  );
};

export default Footer;
