// @flow
import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import { Trans } from "react-i18next";
import fullnodeIllustration from "~/renderer/images/disconnect.png";
import Button from "~/renderer/components/Button";
import { removeLSS } from "~/renderer/modals/FullNode/helpers";

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
  </Box>
);

export const StepDisconnectFooter = ({ onClose }: { onClose: () => void }) => {
  const onConfirmDisconnect = useCallback(() => {
    removeLSS();
    onClose();
  }, []);

  return (
    <Box horizontal alignItems={"flex-end"}>
      <Button secondary onClick={onClose} mr={3}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button primary onClick={onConfirmDisconnect}>
        <Trans i18nKey="fullNode.modal.steps.disconnect.cta" />
      </Button>
    </Box>
  );
};

export default Disconnect;
