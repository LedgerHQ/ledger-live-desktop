// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { space, fontSize, fontWeight, color } from "styled-system";
import noop from "lodash/noop";
import get from "lodash/get";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { track } from "~/renderer/analytics/segment";
import { isGlobalTabEnabled } from "~/config/global-tab";
import { darken, lighten, rgba } from "~/renderer/styles/helpers";
import fontFamily from "~/renderer/styles/styled/fontFamily";
import { focusedShadowStyle } from "~/renderer/components/Box/Tabbable";

import Spinner from "~/renderer/components/Spinner";

type Style = any; // FIXME

const buttonStyles: { [_: string]: Style } = {
  default: {
    default: p => `
      box-shadow: ${p.isFocused ? focusedShadowStyle : ""}
    `,
    active: p => `
      background: ${rgba(p.theme.colors.palette.divider, 0.2)};
    `,
    hover: p => `
      background: ${rgba(p.theme.colors.palette.divider, 0.1)};
    `,
  },
  primary: {
    default: p => `
      background: ${
        p.disabled
          ? `${p.theme.colors.palette.action.disabled} !important`
          : p.inverted
          ? p.theme.colors.palette.primary.contrastText
          : p.theme.colors.palette.primary.main
      };
      color: ${
        p.disabled
          ? p.theme.colors.palette.text.shade20
          : p.inverted
          ? p.theme.colors.palette.primary.main
          : p.theme.colors.palette.primary.contrastText
      };
      box-shadow: ${
        p.isFocused
          ? `
          0 0 0 1px ${darken(p.theme.colors.palette.primary.main, 0.3)} inset,
          0 0 0 1px ${rgba(p.theme.colors.palette.primary.main, 0.5)},
          0 0 0 3px ${rgba(p.theme.colors.palette.primary.main, 0.3)};`
          : ""
      }
    `,
    hover: p => `
       background: ${
         p.inverted
           ? darken(p.theme.colors.palette.primary.contrastText, 0.05)
           : lighten(p.theme.colors.palette.primary.main, 0.05)
       };
     `,
    active: p => `
       background: ${
         p.inverted
           ? darken(p.theme.colors.palette.primary.contrastText, 0.1)
           : darken(p.theme.colors.palette.primary.main, 0.1)
       };
     `,
  },
  danger: {
    default: p => `
      background: ${
        p.disabled
          ? `${p.theme.colors.palette.action.disabled} !important`
          : p.theme.colors.alertRed
      };
      color: ${
        p.disabled
          ? p.theme.colors.palette.text.shade20
          : p.theme.colors.palette.primary.contrastText
      };
      box-shadow: ${
        p.isFocused
          ? `
          0 0 0 1px ${darken(p.theme.colors.alertRed, 0.3)} inset,
          0 0 0 1px ${rgba(p.theme.colors.alertRed, 0.5)},
          0 0 0 3px ${rgba(p.theme.colors.alertRed, 0.3)};
        `
          : ""
      }
    `,
    hover: p => `
      background: ${lighten(p.theme.colors.alertRed, 0.1)};
     `,
    active: p => `
      background: ${darken(p.theme.colors.alertRed, 0.1)};
     `,
  },
  lighterPrimary: {
    default: p => `
      background: ${
        p.disabled
          ? `${p.theme.colors.palette.action.disabled} !important`
          : p.theme.colors.palette.action.hover
      };
      color: ${
        p.disabled
          ? `${p.theme.colors.palette.text.shade20} !important`
          : p.theme.colors.palette.primary.main
      };
      box-shadow: ${
        p.isFocused
          ? `
          0 0 0 1px ${darken(p.theme.colors.palette.primary.main, 0.3)} inset,
          0 0 0 1px ${rgba(p.theme.colors.palette.primary.main, 0.5)},
          0 0 0 3px ${rgba(p.theme.colors.palette.primary.main, 0.3)};`
          : ""
      }
    `,
    hover: p => `
       background: ${lighten(p.theme.colors.palette.action.hover, 0.05)};
     `,
    active: p => `
       background: ${darken(p.theme.colors.palette.action.hover, 0.1)};
     `,
  },
  lighterDanger: {
    default: p => `
      color: ${
        p.disabled
          ? `${p.theme.colors.palette.action.disabled} !important`
          : p.theme.colors.alertRed
      };
    `,
    hover: p => `
      color: ${p.theme.colors.alertRed};
     `,
    active: p => `
      color: ${p.theme.colors.alertRed};
     `,
  },
  outline: {
    default: p => {
      const c = p.outlineColor
        ? get(p.theme.colors, p.outlineColor) || p.outlineColor
        : p.theme.colors.palette.primary.main;

      return `
        background: transparent;
        border: 1px solid ${c};
        color: ${c};
        box-shadow: ${
          p.isFocused
            ? `
            0 0 0 3px ${rgba(c, 0.3)};`
            : ""
        }
      `;
    },
    hover: p => {
      const c = p.outlineColor
        ? get(p.theme.colors, p.outlineColor) || p.outlineColor
        : p.theme.colors.palette.primary.main;
      return `
        background: ${rgba(c, 0.1)};
      `;
    },
    active: p => {
      const c = p.outlineColor
        ? get(p.theme.colors, p.outlineColor) || p.outlineColor
        : p.theme.colors.palette.primary.main;
      return `
        background: ${rgba(c, 0.15)};
        color: ${darken(
          p.outlineColor
            ? get(p.theme.colors, p.outlineColor) || p.outlineColor
            : p.theme.colors.palette.primary.main,
          0.1,
        )};
        border-color: ${darken(
          p.outlineColor
            ? get(p.theme.colors, p.outlineColor) || p.outlineColor
            : p.theme.colors.palette.primary.main,
          0.1,
        )};
      `;
    },
  },
  outlineGrey: {
    default: p => `
      background: transparent;
      border: 1px solid ${p.theme.colors.palette.text.shade60};
      color: ${p.theme.colors.palette.text.shade60};
      box-shadow: ${p.isFocused ? focusedShadowStyle : ""}
    `,
    active: p => `
      color: ${darken(p.theme.colors.palette.text.shade60, 0.1)};
      border-color: ${darken(p.theme.colors.palette.text.shade60, 0.1)};
    `,
  },
  icon: {
    default: () => `
      font-size: ${fontSize[3]}px;
      padding-left: ${space[1]}px;
      padding-right: ${space[1]}px;
    `,
  },
  isLoading: {
    default: () => `
      padding-left: 40px;
      padding-right: 40px;
      pointer-events: none;
      opacity: 0.7;
    `,
  },
};

function getStyles(props, state) {
  let output = "";
  let hasModifier = false;
  for (const s in buttonStyles) {
    if (buttonStyles.hasOwnProperty(s) && props[s] === true) {
      const style = buttonStyles[s][state];
      if (style) {
        hasModifier = true;
        output += style(props);
      }
    }
  }
  if (!hasModifier) {
    const defaultStyle = buttonStyles.default[state];
    if (defaultStyle) {
      output += defaultStyle(props) || "";
    }
  }

  return output;
}
const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChildrenWrapper = styled.div`
  opacity: ${p => (p.isLoading ? 0 : 1)};
  flex-shrink: 1;
  display: flex;
  align-items: center;
`;

export const Base: ThemedComponent<*> = styled.button.attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: p.fontSize || (!p.small ? 4 : 3),
  px: !p.small ? 4 : 3,
  py: !p.small ? 2 : 0,
  color: p.color || p.theme.colors.palette.text.shade60,
  bg: "transparent",
}))`
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  ${fontFamily};
  border: none;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: row;
  align-items: center;
  border-radius: ${p => p.theme.radii[1]}px;
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  height: ${p => (p.small ? 34 : 40)}px;
  pointer-events: ${p => (p.disabled ? "none" : "")};
  outline: none;

  ${p => getStyles(p, "default")};

  &:hover {
    ${p => getStyles(p, "hover")};
  }
  &:active {
    ${p => getStyles(p, "active")};
  }
  &:focus {
    ${p => getStyles(p, "focus")};
  }
`;

export type Props = {
  children?: any,
  icon?: boolean,
  primary?: boolean,
  inverted?: boolean, // only used with primary for now
  lighterPrimary?: boolean,
  danger?: boolean,
  lighterDanger?: boolean,
  disabled?: boolean,
  outline?: boolean,
  outlineGrey?: boolean,
  onClick?: Function,
  small?: boolean,
  isLoading?: boolean,
  event?: string,
  eventProperties?: Object,
  mr?: number,
};

class Button extends PureComponent<
  Props,
  {
    isFocused: boolean,
  },
> {
  static defaultProps = {
    onClick: noop,
    primary: false,
    small: false,
    danger: false,
    inverted: false,
  };

  state = {
    isFocused: false,
  };

  handleFocus = () => {
    if (isGlobalTabEnabled()) {
      this.setState({ isFocused: true });
    }
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { isFocused } = this.state;
    const { disabled } = this.props;
    const { onClick, children, isLoading, event, eventProperties, ...rest } = this.props;
    const isClickDisabled = disabled || isLoading;
    const onClickHandler = e => {
      if (onClick) {
        if (event) {
          track(event, eventProperties);
        }
        onClick(e);
      }
    };
    return (
      <Base
        {...rest}
        onClick={isClickDisabled ? undefined : onClickHandler}
        isFocused={isFocused}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {isLoading ? (
          <LoadingWrapper>
            <Spinner size={16} />
          </LoadingWrapper>
        ) : null}
        <ChildrenWrapper isLoading={isLoading}>{children}</ChildrenWrapper>
      </Base>
    );
  }
}

export default Button;
