import styled, { css } from "styled-components";
import { fontFamily, fontSize, textAlign } from "styled-system";
import FlexBox from "@components/Layout/Flex";
import React, { useState } from "react";

export default {
  title: "Input/Base",
  argTypes: {
    disabled: {
      type: "boolean",
    },
  },
};

const InputContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  background: #ffffff;
  /* Light/Primary/140 */
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  transition: all 0.2s ease;

  ${p =>
    p.focus &&
    css`
      border: 1px solid #8b80db;
      /* Focus/Light */

      box-shadow: 0px 0px 0px 4px rgba(187, 176, 255, 0.4);
    `};

  ${p =>
    p.error &&
    css`
      border: 1px solid #f04f52;
    `};

  &:hover {
    border: ${p => !p.disabled && "1px solid #6358b7"};
  }

  ${p =>
    p.disabled &&
    css`
      color: rgba(193, 193, 193, 1);
      background: #f4f4f4;
      border: 1px solid #e8e8e8;
      box-sizing: border-box;
      border-radius: 24px;
    `};
`;

const BaseInput = styled.input.attrs(() => ({}))`
  ${fontFamily};
  ${fontSize};
  ${textAlign};
  border: 0;
  color: ${p => p.theme.colors.palette.text.shade100};
  height: 100%;
  outline: none;
  padding-top: 14px;
  padding-bottom: 14px;
  width: 100%;
  background: none;
  cursor: ${p => (p.disabled ? "not-allowed" : "text")};
  padding-left: 20px;
  padding-right: 20px;
  flex-shrink: 1;
  &::placeholder {
    color: ${p => p.theme.colors.palette.text.shade40};
  }
`;

export const Default = (args): JSX.Element => {
  const [disabled, setDisabled] = useState(false);
  const [focus, setFocus] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div>
      <InputContainer disabled={disabled} focus={focus} error={error}>
        <FlexBox alignItems={"center"}>
          <button onClick={() => setDisabled(!disabled)}>disable</button>
        </FlexBox>
        <BaseInput
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        <FlexBox alignItems={"center"}>
          <button onClick={() => setError(error ? "" : "Error message")}>error</button>
        </FlexBox>
      </InputContainer>
    </div>
  );
};
