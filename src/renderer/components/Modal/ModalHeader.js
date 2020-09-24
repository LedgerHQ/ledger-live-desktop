// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Tabbable from "~/renderer/components/Box/Tabbable";

import IconCross from "~/renderer/icons/Cross";
import IconAngleLeft from "~/renderer/icons/AngleLeft";

const MODAL_HEADER_STYLE = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 10,
  position: "relative",
  flexDirection: "row",
};

const TitleContainer = styled(Box).attrs(() => ({
  vertical: true,
}))`
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
`;

const ModalTitle = styled(Box).attrs(() => ({
  color: "palette.text.shade100",
  ff: "Inter|Medium",
  fontSize: 6,
}))`
  text-align: center;
  line-height: 1;
`;

const ModalSubTitle = styled(Box).attrs(() => ({
  color: "palette.text.shade50",
  ff: "Inter|Regular",
  fontSize: 3,
}))`
  text-align: center;
  line-height: 2;
`;

const ModalHeaderAction = styled(Tabbable).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  fontSize: 3,
  p: 3,
}))`
  border-radius: 8px;
  color: ${p => p.color || p.theme.colors.palette.text.shade60};
  top: 0;
  align-self: ${p => (p.right ? "flex-end" : "flex-start")};
  line-height: 0;
  ${p =>
    p.onClick
      ? `
    cursor: pointer;

    &:hover,
    &:hover ${
      // $FlowFixMe
      Text
    } {
      color: ${p.theme.colors.palette.text.shade80};
    }

    &:active,
    &:active ${
      // $FlowFixMe
      Text
    } {
      color: ${p.theme.colors.palette.text.shade100};
    }

    ${
      // $FlowFixMe
      Text
    } {
      border-bottom: 1px dashed transparent;
    }
    &:focus span {
      border-bottom-color: none;
    }
  `
      : ""}
`;

const ModalHeader = ({
  children,
  subTitle,
  onBack,
  onClose,
  style = {},
}: {
  children: any,
  subTitle?: React$Node,
  onBack?: void => void,
  onClose?: void => void,
  style?: *,
}) => {
  const { t } = useTranslation();
  return (
    <div style={{ ...MODAL_HEADER_STYLE, ...style }}>
      {onBack ? (
        <ModalHeaderAction onClick={onBack} id="modal-back-button">
          <IconAngleLeft size={12} />
          <Text ff="Inter|Medium" fontSize={4} color="palette.text.shade40">
            {t("common.back")}
          </Text>
        </ModalHeaderAction>
      ) : (
        <div />
      )}
      {children || subTitle ? (
        <TitleContainer>
          {subTitle && <ModalSubTitle id="modal-subtitle">{subTitle}</ModalSubTitle>}
          <ModalTitle id="modal-title">{children}</ModalTitle>
        </TitleContainer>
      ) : null}
      {onClose ? (
        <ModalHeaderAction
          right
          color="palette.text.shade40"
          onClick={onClose}
          id="modal-close-button"
        >
          <IconCross size={16} />
        </ModalHeaderAction>
      ) : (
        <div />
      )}
    </div>
  );
};

export default ModalHeader;
