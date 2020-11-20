// @flow
import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { useDispatch } from "react-redux";
import { cleanFullNodeDisconnect } from "~/renderer/actions/accounts";
import styled from "styled-components";
import { Trans } from "react-i18next";
import fullnodeIllustration from "~/renderer/images/disconnect.png";
import Button from "~/renderer/components/Button";
import { removeLSS } from "~/renderer/storage";

const Illustration = styled.div`
  margin-bottom: 24px;
  width: 236px;
  height: 64px;
  background: url(${fullnodeIllustration});
  background-size: contain;
  align-self: center;
`;

const Disconnect = () => (
  <Box>
    <Illustration />
    <Text
      mx={30}
      ff="Inter|Regular"
      textAlign={"center"}
      mt={32}
      fontSize={4}
      color="palette.text.shade50"
    >
      <Trans i18nKey={"fullNode.modal.steps.disconnect.description"} />
    </Text>
  </Box>
);

export const StepDisconnectFooter = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch();
  const onConfirmDisconnect = useCallback(() => {
    removeLSS();
    dispatch(cleanFullNodeDisconnect());
    onClose();
  }, [dispatch, onClose]);

  return (
    <Box horizontal alignItems={"flex-end"}>
      <Button secondary onClick={onClose} mr={3}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button danger onClick={onConfirmDisconnect}>
        <Trans i18nKey="fullNode.modal.steps.disconnect.cta" />
      </Button>
    </Box>
  );
};

export default Disconnect;
