import React from "react";
import { useTranslation } from "react-i18next";

import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";

import { Flex, Text } from "@ledgerhq/react-ui";

type Props = {
  isOpened: boolean;
  isDanger?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  desc?: React.ReactNode;
  renderIcon?: Function;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  onReject?: Function;
  onClose?: () => void;
  onConfirm: Function;
  isLoading?: boolean;
  analyticsName: string;
  cancellable?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
  narrow?: boolean;
  name?: string;
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
      width={narrow ? 380 : undefined}
      onClose={!cancellable && isLoading ? undefined : onClose}
      preventBackdropClick={isLoading}
      backdropColor
    >
      <ModalBody
        {...props}
        onClose={!cancellable && isLoading ? undefined : onClose}
        title={title}
        renderFooter={() => (
          <Flex alignItems="center" justifyContent="flex-end" columnGap={5} flexGrow={1}>
            {!isLoading && onReject && (
              <Button onClick={onReject} variant="shade">
                {realCancelText}
              </Button>
            )}
            <Button
              onClick={onConfirm}
              variant={isDanger ? "error" : "main"}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {realConfirmText}
            </Button>
          </Flex>
        )}
        render={() => (
          <Flex flexDirection="column" rowGap={5} mt={8} px={4}>
            {subTitle && (
              <Text ff="Inter|Regular" color="neutral.c100" textAlign="center" mb={2} mt={3}>
                {subTitle}
              </Text>
            )}
            {renderIcon && (
              <Flex justifyContent="center" alignItems="center" mt={4} mb={3}>
                {renderIcon()}
              </Flex>
            )}
            {desc && (
              <Text ff="Inter|Regular" color="neutral.c80" fontSize={4} textAlign="center">
                {desc}
              </Text>
            )}
            {children}
          </Flex>
        )}
      />
      <TrackPage category="Modal" name={analyticsName} />
    </Modal>
  );
};

export default ConfirmModal;
