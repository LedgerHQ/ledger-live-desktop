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
import { MarketContext } from "~/renderer/contexts/MarketContext";
import { RELOAD } from "~/renderer/contexts/actionTypes";
import { useTranslation } from "react-i18next";

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
  const { contextDispatch } = useContext(MarketContext);
  const { t } = useTranslation();
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
      render={({ onClose }) => (
        <ModalBody
          noScroll
          onClose={onClose}
          render={() => (
            <Box alignItems="center">
              <WarningSignWrapper>
                <TriangleWarningIcon size={20} />
              </WarningSignWrapper>
              <Text fontSize="18" fontWeight="600" mb="8px">
                {t("market.warnings.connectionError")}
              </Text>
              <Text fontSize="13" fontWeight="400">
                {t("market.warnings.ledgerUnableToRetrieveData")}
              </Text>
              <Text fontSize="13" fontWeight="400">
                {t("market.warnings.checkInternetAndReload")}
              </Text>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button onClick={handleReset} mr={2}>
                {t("common.close")}
              </Button>
              <Button onClick={reload} primary>
                {t("market.warnings.reload")}
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
};

export default ConnectionErrorModal;
