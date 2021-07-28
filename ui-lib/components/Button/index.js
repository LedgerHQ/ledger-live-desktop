// @flow
import React, { useState } from "react";
import styled, { css } from "styled-components";
import { fontSize, color } from "styled-system";
import type { ThemedComponent } from "@ui/styles/StyleProvider";
import fontFamily from "@ui/styles/styled/fontFamily";
import { fontSizes } from "@ui/styles/theme";
import ChevronDown from "@ui/icons/ChevronDown";

type Props = {
  Icon?: React$ComponentType<*>,
  children?: React$Node,
  onClick: () => void,
  ff?: string,
  color?: string,
  fontSize?: number,
  type?: "primary" | "secondary",
  iconPosition?: "right" | "left",
};

const IconContainer: ThemedComponent<{ iconPosition: "right" | "left" }> = styled.div`
  display: inline-block;
  ${p => (p.iconPosition === "left" ? `margin-right: 10px;` : `margin-left: 10px;`)}
  padding-top: 0.2em;
`;

export const Base: ThemedComponent<{
  Icon?: React$ComponentType<*>,
  ff?: string,
  color?: string,
  fontSize?: number,
  type?: "primary" | "secondary",
  iconPosition?: "right" | "left",
  ...
}> = styled.button.attrs(p => ({
  ff: "Inter|SemiBold",
  color: "palette.v2.text.default",
  fontSize: p.fontSize ?? 4,
}))`
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
  ${p => {
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
      : ``}
  ${p => p.theme.transition()}
`;

const ContentContainer: ThemedComponent<*> = styled.div``;

const Button = ({ Icon, iconPosition = "right", children, onClick, ...props }: Props) => {
  return (
    <Base {...props} iconButton={!!Icon && !children} onClick={onClick}>
      {iconPosition === "right" ? <ContentContainer>{children}</ContentContainer> : null}
      {Icon ? (
        <IconContainer iconPosition={iconPosition}>
          <Icon size={fontSizes[props.fontSize ?? 4]} />
        </IconContainer>
      ) : null}
      {iconPosition === "left" ? <ContentContainer>{children}</ContentContainer> : null}
    </Base>
  );
};

const StyledExpandButton: any = styled(Button).attrs(props => ({
  Icon: props.Icon || ChevronDown,
  iconPosition: props.iconPosition || "right",
}))`
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
  onToggle?: boolean => void,
  onClick?: (SyntheticEvent<HTMLButtonElement>) => void,
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <StyledExpandButton
      {...props}
      expanded={expanded}
      onClick={event => {
        setExpanded(expanded => !expanded);
        onToggle && onToggle(!expanded);
        onClick && onClick(event);
      }}
    />
  );
};

export default Button;
