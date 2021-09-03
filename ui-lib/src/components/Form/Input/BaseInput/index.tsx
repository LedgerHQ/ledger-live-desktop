import styled, { css } from "styled-components";
import FlexBox from "../../../Layout/Flex";
import React, { InputHTMLAttributes } from "react";
import Text from "../../../Text";

type CommonProps = InputHTMLAttributes<HTMLInputElement> & {
  disabled?: boolean;
  error?: string;
};

export type InputProps = CommonProps & {
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  renderLeft?: ((props: CommonProps) => React.ReactNode) | React.ReactNode;
  renderRight?: ((props: CommonProps) => React.ReactNode) | React.ReactNode;
};

const InputContainer = styled.div<Partial<CommonProps> & { focus?: boolean }>`
  display: flex;
  background: #ffffff;
  height: 48px;
  border: ${p => `1px solid ${p.theme.colors.palette.v2.grey.borderLight}`};
  border-radius: 24px;
  transition: all 0.2s ease;
  color: ${p => p.theme.colors.palette.v2.text.default};

  ${p =>
    p.focus &&
    !p.error &&
    css`
      border: 1px solid ${p.theme.colors.palette.v2.primary.borderDark};
      box-shadow: 0 0 0 4px ${p.theme.colors.palette.v2.primary.fadedBase};
    `};

  ${p =>
    p.error &&
    !p.disabled &&
    css`
      border: 1px solid ${p.theme.colors.palette.v2.feedback.error};
    `};

  ${p =>
    !p.error &&
    !p.disabled &&
    css`
      &:hover {
        border: ${!p.disabled && `1px solid ${p.theme.colors.palette.v2.primary.dark}`};
      }
    `};

  ${p =>
    p.disabled &&
    css`
      color: ${p.theme.colors.palette.v2.text.disabled};
      background: ${p => p.theme.colors.palette.v2.background.grey};
    `};
`;

const BaseInput = styled.input<Partial<CommonProps> & { focus?: boolean }>`
  height: 100%;
  width: 100%;
  border: 0;
  caret-color: ${p =>
    p.error
      ? p.theme.colors.palette.v2.feedback.error
      : p.theme.colors.palette.v2.primary.borderDark};
  background: none;
  outline: none;
  cursor: ${p => (p.disabled ? "not-allowed" : "text")};
  flex-shrink: 1;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 20px;
  padding-right: 20px;
  &::placeholder {
    color: ${p => p.theme.colors.palette.v2.text.tertiary};
  }

  /* Hide type=number arrow for Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide type=number arrow for Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const InputErrorContainer = styled(Text).attrs(() => ({ type: "small3" }))`
  color: ${p => p.theme.colors.palette.v2.feedback.error};
  margin-left: 12px;
`;

export const InputRenderLeftContainer = styled(FlexBox).attrs(() => ({
  alignItems: "center",
  pl: "16px",
}))``;

export const InputRenderRightContainer = styled(FlexBox).attrs(() => ({
  alignItems: "center",
  pr: "16px",
}))``;

export default function Input(props: InputProps): JSX.Element {
  const { value, disabled, error, onChange, renderLeft, renderRight, ...htmlInputProps } = props;
  const [focus, setFocus] = React.useState(false);

  return (
    <div>
      <InputContainer disabled={disabled} focus={focus} error={error}>
        {typeof renderLeft === "function" ? renderLeft(props) : renderLeft}
        <BaseInput
          {...htmlInputProps}
          disabled={disabled}
          error={error}
          onChange={onChange}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={"ll-text_body"}
        />
        {typeof renderRight === "function" ? renderRight(props) : renderRight}
      </InputContainer>
      {error && !disabled && <InputErrorContainer>{error}</InputErrorContainer>}
    </div>
  );
}
