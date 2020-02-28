// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import Modal, { ModalBody } from "~/renderer/components/Modal";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/manager";

const Container = styled.div`
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type Props = {
  isOpened: boolean,
  onClose: () => void,
  onSuccess: () => void,
};

const GenuineCheckModal = ({ isOpened, onClose, onSuccess }: Props) => {
  return (
    <Modal
      isOpened={isOpened}
      onClose={onClose}
      width={600}
      render={({ onClose }) => (
        <ModalBody
          onClose={onClose}
          title={<Trans i18nKey="genuinecheck.modal.title" />}
          render={() => (
            <Container>
              <DeviceAction action={action} onResult={onSuccess} request={null} />
            </Container>
          )}
        />
      )}
    />
  );
};

export default GenuineCheckModal;
