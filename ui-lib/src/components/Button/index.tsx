import React, { useState } from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { fontSize, color } from "styled-system";
import fontFamily from "@styles/styled/fontFamily";
import { fontSizes } from "@styles/theme";
import ChevronBottom from "@ui/assets/icons/ChevronBottomRegular";

type ButtonTypes = "primary" | "secondary";

interface Props {
  Icon?: React.ComponentType<any>;
  children?: React.ReactNode;
  onClick: () => void;
  ff?: string;
  color?: string;
  fontSize?: number;
  type?: ButtonTypes;
  iconPosition?: "right" | "left";
}
const IconContainer = styled.div<{
  iconPosition: "right" | "left";
}>`
  display: inline-block;
  ${p => (p.iconPosition === "left" ? "margin-right: 10px;" : "margin-left: 10px;")}
  padding-top: 0.2em;
`;

interface BaseProps {
  Icon?: React.ComponentType<any>;
  ff?: string;
  color?: string;
  fontSize?: number;
  type?: ButtonTypes;
  iconPosition?: "right" | "left";
  iconButton?: boolean;
  iconSize?: number,
  disabled?: boolean;
  theme: DefaultTheme;
}

export const Base = styled.button.attrs((p: BaseProps) => ({
  ff: "Inter|SemiBold",
  color: p.color ?? "palette.v2.text.default",
  fontSize: p.fontSize ?? 4,
}))<BaseProps>`
  ${fontFamily};
  ${fontSize};
  ${color};
  border-radius: ${p => p.theme.space[6]}px;
  height: ${p => p.theme.space[6]}px;
  line-height: ${p => p.theme.fontSizes[p.fontSize]}px;
  border-style: solid;
  border-width: 1px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-color: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  position: relative;
  cursor: ${p => (p.disabled ? "default" : "pointer")};
  ${(p: BaseProps) => {
    switch (p.type) {
      case "primary":
        return p.disabled
          ? `
          background-color: ${p.theme.colors.palette.v2.grey.border};
          color: ${p.theme.colors.palette.v2.text.tertiary};
          padding: 0 2em;
        `
          : `
          background-color: ${p.theme.colors.palette.v2.primary.base};
          color: ${p.theme.colors.palette.v2.text.contrast};
          padding: 0 2em;
          &:hover {
            background-color: ${p.theme.colors.palette.v2.primary.borderDark};
            ${
              p.iconButton
                ? `box-shadow: 0px 0px 0px 12px ${p.theme.colors.palette.v2.grey.border};`
                : ""
            }

          }
        `;

      case "secondary":
        return p.disabled
          ? `
            border-color: ${p.theme.colors.palette.v2.grey.border};
            color: ${p.theme.colors.palette.v2.grey.border};
            padding: 0 2em;
          `
          : `
            border-color: ${p.theme.colors.palette.v2.grey.border};
            padding: 0 2em;
            &:hover {
              border-color: ${p.theme.colors.palette.v2.text.default};
            }
          `;

      default:
        return p.disabled
          ? `
            color: ${p.theme.colors.palette.v2.text.tertiary};
          `
          : `
            &:hover {
              text-decoration: underline;
            }
          `;
    }
  }}
  ${p =>
    p.iconButton
      ? css`
          width: ${p.theme.space[6]}px;
          padding: 0;
          ${IconContainer} {
            margin: 0;
          }
        `
      : ""}
  ${p => p.theme.transition()}
`;

const ContentContainer = styled.div``;

const Button = ({
  Icon,
  iconPosition = "right",
  iconSize = 16,
  children,
  onClick,
  ...props
}: Props) => {
  return (
    // @ts-expect-error type button conflict
    <Base {...props} iconButton={!(Icon == null) && !children} onClick={onClick}>
      {iconPosition === "right" ? <ContentContainer>{children}</ContentContainer> : null}
      {Icon != null ? (
        <IconContainer iconPosition={iconPosition}>
          <Icon size={iconSize || fontSizes[props.fontSize ?? 4]} />
        </IconContainer>
      ) : null}
      {iconPosition === "left" ? <ContentContainer>{children}</ContentContainer> : null}
    </Base>
  );
};

const StyledExpandButton: any = styled(Button).attrs(props => ({
  Icon: props.Icon != null || ChevronBottom,
  iconPosition: props.iconPosition || "right",
}))<BaseProps & { expanded: boolean }>`
  ${IconContainer} {
    transition: transform 0.25s;
    ${p => (p.expanded ? "transform: rotate(180deg)" : "")}
  }
`;
export const ExpandButton = function ExpandButton({
  onToggle,
  onClick,
  ...props
}: {
  onToggle?: (arg0: boolean) => void;
  onClick?: (arg0: React.SyntheticEvent<HTMLButtonElement>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <StyledExpandButton
      {...props}
      expanded={expanded}
      onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
        setExpanded(expanded => !expanded);
        onToggle != null && onToggle(!expanded);
        onClick != null && onClick(event);
      }}
    />
  );
};
export default Button;
