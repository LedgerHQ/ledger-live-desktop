// @flow
import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { useDispatch } from "react-redux";
import { closeModal, openModal } from "~/renderer/actions/modals";

import AmountUp from "~/renderer/icons/AmountUp";
import Modal, { ModalBody } from "~/renderer/components/Modal/index";
import Box from "~/renderer/components/Box/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

const AmountUpWrapper = styled.div`
  padding: ${p => p.theme.space[3]}px;
  box-sizing: content-box;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  color: ${p => p.theme.colors.warning};
  background-color: ${p => p.theme.colors.lightWarning};
`;

type Props = {
  name: string,
  nextModal?: [string, *],
  ...
};

const HighFeesModal = ({ name, nextModal, ...rest }: Props) => {
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(closeModal(name));
    nextModal && dispatch(openModal(...nextModal));
  }, [dispatch, name, nextModal]);
  return (
    <Modal
      {...rest}
      name={name}
      centered
      onClose={handleClose}
      preventBackdropClick
      render={({ onClose, data }) => (
        <ModalBody
          title={<Trans i18nKey="lend.title" />}
          noScroll
          render={onClose => (
            <Box flow={4}>
              <Box alignItems="center">
                <AmountUpWrapper>
                  <AmountUp size={24} />
                </AmountUpWrapper>
                <Text ff="Inter|Bold" my={2} fontSize={4} textAlign="center">
                  <Trans i18nKey="lend.highFeesModal.title" />
                </Text>
                <Text ff="Inter|Regular" fontSize={3} textAlign="center">
                  <Trans i18nKey="lend.highFeesModal.description" />
                </Text>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal flex="1 1 0%">
              <Box grow />
              <Button primary onClick={onClose}>
                <Trans i18nKey="lend.highFeesModal.cta" />
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
};

export default memo<Props>(HighFeesModal);
