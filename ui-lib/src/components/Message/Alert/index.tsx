import React from "react";
import styled, { css } from "styled-components";
import Text from "@components/Text";
import ShieldSecurityMedium from "@ui/assets/icons/ShieldSecurityMedium";
import CircledCrossMedium from "@ui/assets/icons/CircledCrossMedium";
import CircledAlertMedium from "@ui/assets/icons/CircledAlertMedium";

type AlertType = "info" | "warning" | "error";

export interface AlertProps {
  type?: AlertType;
  title: string;
  showIcon?: boolean;
}

const StyledIconContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

const icons = {
  info: <ShieldSecurityMedium size={20} />,
  warning: <CircledAlertMedium size={20} />,
  error: <CircledCrossMedium size={20} />,
};

const StyledAlertContainer = styled.div<{ type?: AlertType }>`
  ${p => {
    switch (p.type) {
      case "warning":
        return css`
          background: ${p.theme.colors.palette.v2.warning.backgroundLight};
          color: ${p.theme.colors.palette.v2.warning.dark};
        `;
      case "error":
        return css`
          background: ${p.theme.colors.palette.v2.error.backgroundLight};
          color: ${p.theme.colors.palette.v2.error.dark};
        `;
      case "info":
      default:
        return css`
          background: ${p.theme.colors.palette.v2.primary.backgroundLight};
          color: ${p.theme.colors.palette.v2.primary.dark};
        `;
    }
  }}

  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: center;
`;

export default function Alert({ type = "info", title, showIcon = true }: AlertProps): JSX.Element {
  return (
    <StyledAlertContainer type={type}>
      {showIcon && !!icons[type] && <StyledIconContainer>{icons[type]}</StyledIconContainer>}
      <Text type={"body"} color={"inherit"}>
        {title}
      </Text>
    </StyledAlertContainer>
  );
}
