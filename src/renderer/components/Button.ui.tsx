// @flow
import React from "react";
import { Button as BaseButton, InvertTheme } from "@ledgerhq/react-ui";
import { ButtonProps as BaseButtonProps } from "@ledgerhq/react-ui/components/cta/Button";
import { track } from "~/renderer/analytics/segment";
import styled from "styled-components";

export const Base = styled(BaseButton)<{ big?: boolean }>`
  border-radius: 44px;

  font-size: 12px;
  height: 40px;
  line-height: 40px;
  padding: 0 24px;

  ${p =>
    p.variant === "shade"
      ? `background-color: transparent!important;border-color: currentColor;`
      : ``}
`;

export type Props = BaseButtonProps & {
  inverted?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  event?: string;
  eventProperties?: Record<string, unknown>;
};

export default function Button({
  onClick,
  inverted,
  disabled,
  children,
  isLoading,
  event,
  eventProperties,
  ...rest
}: Props) {
  const isClickDisabled = disabled || isLoading;
  const onClickHandler = (e: React.SyntheticEvent<HTMLButtonElement, Event>) => {
    if (onClick) {
      if (event) {
        track(event, eventProperties || {});
      }
      onClick(e);
    }
  };
  const inner = (
    <Base {...rest} onClick={isClickDisabled ? undefined : onClickHandler}>
      {children}
    </Base>
  );
  return inverted ? <InvertTheme>{inner} </InvertTheme> : inner;
}
