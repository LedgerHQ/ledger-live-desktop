// @flow
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import { closeModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import TriangleWarningIcon from "~/renderer/icons/TriangleWarning";
import { rgba } from "~/renderer/styles/helpers";
import { reloadMarket } from "~/renderer/actions/market";
import { MarketContext } from "~/renderer/contexts/MarketContext";
import { RELOAD } from "~/renderer/contexts/actionTypes";

const WarningSignWrapper = styled(Box)`
  border-radius: 50%;
  height: 50px;
  width: 50px;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.alertRed};
  background: ${p => rgba(p.theme.colors.alertRed, 0.1)};
  margin-bottom: 25px;
`;

const ConnectionErrorModal = () => {
  const { contextState, contextDispatch } = useContext(MarketContext);
  const dispatch = useDispatch();
  const handleReset = () => {
    dispatch(closeModal("MODAL_CONNECTION_ERROR"));
  };
  const reload = () => {
    contextDispatch(RELOAD);
    handleReset();
  };
  return (
    <Modal
      name="MODAL_CONNECTION_ERROR"
      centered
      onHide={handleReset}
      preventBackdropClick={false}
      render={({ onClose, data }) => (
        <ModalBody
          noScroll
          onClose={onClose}
          render={() => (
            <Box alignItems="center">
              <WarningSignWrapper>
                <TriangleWarningIcon size={20} />
              </WarningSignWrapper>
              <Text fontSize={18} fontWeight={600} mb="8px">
                Connection Error
              </Text>
              <Text fontSize={13} fontWeight={400}>
                Ledger Live is unable to retrieve data.
              </Text>
              <Text fontSize={13} fontWeight={400}>
                Please check your internet connection and reload this page.
              </Text>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button onClick={handleReset} mr={2}>
                Close
              </Button>
              <Button onClick={reload} primary>
                Reload
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
};

export default ConnectionErrorModal;
