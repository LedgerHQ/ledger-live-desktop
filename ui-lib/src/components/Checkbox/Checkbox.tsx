import React from "react";
import styled from "styled-components";
import Text from "@ui/components/Text";
import CheckAloneRegular from "@ui/assets/icons/CheckAloneRegular";
import { renderToStaticMarkup } from "react-dom/server";

const Icon = styled(CheckAloneRegular).attrs({ size: 13, color: "white" })``;
const CheckMarkIcon = encodeURIComponent(renderToStaticMarkup(<Icon />));

const Input = styled.input`
  background-color: transparent;

  border-radius: 4px;
  position: relative;

  width: 18px;
  height: 18px;
  appearance: none;
  border: 1px solid ${props => props.theme.colors.palette.v2.grey.border};
  box-shadow: none;

  cursor: pointer;

  &:checked {
    background-color: currentColor;
    border-color: currentColor;
  }

  &:checked::after {
    content: " ";
    width: 18px;
    height: 18px;
    display: inline-block;

    background-image: url("data:image/svg+xml,${CheckMarkIcon}");
    background-position: center;
    background-repeat: no-repeat;

    /* Trick to center the check mark by taking into account the border */
    position: absolute;
    top: -1px;
    left: -1px;
  }

  &[disabled] {
    cursor: unset;
  }
`;

const Label = styled(Text).attrs({ type: "body", fontWeight: "500" })`
  color: ${props => props.theme.colors.palette.v2.text.secondary};

  /* Version when the input is checked */
  ${Input}:checked + & {
    color: currentColor;
  }

  &:first-letter {
    text-transform: uppercase;
  }
`;

const Container = styled.div`
  --ll-checkbox-color: unset;
  color: var(--ll-checkbox-color, ${props => props.theme.colors.palette.v2.primary.dark});

  display: inline-flex;
  column-gap: 13px;
  align-items: center;

  &[data-variant="default"] {
    --ll-checkbox-color: ${props => props.theme.colors.palette.v2.primary.dark};
  }

  &[data-variant="success"] {
    --ll-checkbox-color: ${props => props.theme.colors.palette.v2.feedback.successText};
  }

  &[data-variant="error"] {
    --ll-checkbox-color: ${props => props.theme.colors.palette.v2.feedback.error};
  }

  &[data-disabled="true"] {
    --ll-checkbox-color: ${props => props.theme.colors.palette.v2.text.secondary};
  }
`;

export type CheckboxProps = {
  isDisabled?: boolean;
  isChecked: boolean;
  variant?: "default" | "success" | "error";
  label?: string;
  name: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
};

const Checkbox = ({
  isDisabled = false,
  variant = "default",
  label,
  isChecked,
  name,
  onChange,
}: CheckboxProps): JSX.Element => (
  <Container data-variant={variant} data-disabled={isDisabled}>
    <Input
      type="checkbox"
      name={name}
      id={name}
      checked={isChecked}
      onChange={onChange}
      disabled={isDisabled}
    />
    {label ? (
      <Label forwardedAs="label" htmlFor={name}>
        {label}
      </Label>
    ) : null}
  </Container>
);

export default Checkbox;
