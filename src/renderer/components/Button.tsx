// @flow

import React, { PureComponent } from "react";
import noop from "lodash/noop";
import { Button as BaseButton } from "@ledgerhq/react-ui";
import type { ButtonProps } from "@ledgerhq/react-ui/components/cta/Button";
import { track } from "~/renderer/analytics/segment";
import { isGlobalTabEnabled } from "~/config/global-tab";

export const Base: any = BaseButton;
export interface Props extends Omit<ButtonProps, "onClick"> {
  children?: any;
  icon?: boolean;
  primary?: boolean;
  inverted?: boolean; // only used with primary for now
  lighterPrimary?: boolean;
  danger?: boolean;
  lighterDanger?: boolean;
  disabled?: boolean;
  outline?: boolean;
  outlineGrey?: boolean;
  onClick?: Function;
  small?: boolean;
  isLoading?: boolean;
  event?: string;
  eventProperties?: Object;
  mr?: number;
  mx?: number;
};

class Button extends PureComponent<
  Props,
  {
    isFocused: boolean;
  }
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
    const onClickHandler = (e: any) => {
      if (onClick) {
        if (event) {
          track(event, eventProperties || {});
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
        {children}
      </Base>
    );
  }
}

export default Button;
