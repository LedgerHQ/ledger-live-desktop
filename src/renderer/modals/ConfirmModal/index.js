// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";

type Props = {
  isOpened: boolean,
  isDanger?: boolean,
  title?: React$Node,
  subTitle?: React$Node,
  desc?: React$Node,
  renderIcon?: Function,
  confirmText?: React$Node,
  cancelText?: React$Node,
  onReject?: Function,
  onClose?: Function,
  onConfirm: Function,
  isLoading?: boolean,
  analyticsName: string,
  cancellable?: boolean,
  centered?: boolean,
  children?: *,
  narrow?: boolean,
  name?: string,
};

const ConfirmModal = ({
  cancellable,
  isOpened,
  title,
  subTitle,
  desc,
  confirmText,
  cancelText,
  isDanger,
  onReject,
  onConfirm,
  isLoading,
  renderIcon,
  onClose,
  analyticsName,
  centered,
  children,
  narrow,
  name,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const realConfirmText = confirmText || t("common.confirm");
  const realCancelText = cancelText || t("common.cancel");
  return (
    <Modal
      name={name}
      isOpened={isOpened}
      centered={centered}
      width={narrow && 380}
      onClose={!cancellable && isLoading ? undefined : onClose}
      preventBackdropClick={isLoading}
      backdropColor
    >
      <ModalBody
        {...props}
        preventBackdropClick={isLoading}
        onClose={!cancellable && isLoading ? undefined : onClose}
        title={title}
        renderFooter={() => (
          <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
            {!isLoading && onReject && (
              <Button onClick={onReject} data-test-id="modal-cancel-button">
                {realCancelText}
              </Button>
            )}
            <Button
              onClick={onConfirm}
              primary={!isDanger}
              danger={isDanger}
              isLoading={isLoading}
              disabled={isLoading}
              data-test-id="modal-confirm-button"
            >
              {realConfirmText}
            </Button>
          </Box>
        )}
        render={() => (
          <Box>
            {subTitle && (
              <Box
                ff="Inter|Regular"
                color="palette.text.shade100"
                textAlign="center"
                mb={2}
                mt={3}
              >
                {subTitle}
              </Box>
            )}
            {renderIcon && (
              <Box justifyContent="center" alignItems="center" mt={4} mb={3}>
                {renderIcon()}
              </Box>
            )}
            {desc && (
              <Box ff="Inter" color="palette.text.shade80" fontSize={4} textAlign="center">
                {desc}
              </Box>
            )}
            {children}
          </Box>
        )}
      />
      <TrackPage category="Modal" name={analyticsName} />
    </Modal>
  );
};

export default ConfirmModal;
