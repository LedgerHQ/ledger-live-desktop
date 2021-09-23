import React from "react";
import styled from "styled-components";
import Text from "@ui/components/asorted/Text";
import CheckAloneRegular from "@ui/assets/icons/CheckAloneRegular";
import { renderToStaticMarkup } from "react-dom/server";

const Icon = styled(CheckAloneRegular).attrs({ size: 13, color: "white" })``;
const CheckMarkIcon = encodeURIComponent(renderToStaticMarkup(<Icon />));

const Input = styled.input`
  background-color: transparent;

  border-radius: 4px;
  position: relative;

  width: ${(p) => p.theme.space[7]}px;
  height: ${(p) => p.theme.space[7]}px;
  appearance: none;
  border: 1px solid ${(props) => props.theme.colors.palette.neutral.c90};
  box-shadow: none;

  &:checked {
    background-color: currentColor;
    border-color: currentColor;
  }

  &:checked::after {
    content: " ";
    width: ${(p) => p.theme.space[7]}px;
    height: ${(p) => p.theme.space[7]}px;
    display: inline-block;

    background-image: url("data:image/svg+xml,${CheckMarkIcon}");
    background-position: center;
    background-repeat: no-repeat;

    /* Trick to center the check mark by taking into account the border */
    position: absolute;
    top: -1px;
    left: -1px;
  }
`;

const Label = styled(Text).attrs({ type: "body", fontWeight: "500" })`
  color: ${(props) => props.theme.colors.palette.neutral.c80};

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
  color: var(--ll-checkbox-color, ${(props) => props.theme.colors.palette.primary.c160});

  display: inline-flex;
  column-gap: ${(p) => p.theme.space[5]}px;
  align-items: center;
  cursor: pointer;

  &[data-variant="default"] {
    --ll-checkbox-color: ${(props) => props.theme.colors.palette.primary.c160};
  }

  &[data-variant="success"] {
    --ll-checkbox-color: ${(props) => props.theme.colors.palette.success.c100};
  }

  &[data-variant="error"] {
    --ll-checkbox-color: ${(props) => props.theme.colors.palette.error.c100};
  }

  &[data-disabled="true"] {
    --ll-checkbox-color: ${(props) => props.theme.colors.palette.neutral.c80};
    cursor: unset;
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
  <Container data-variant={variant} data-disabled={isDisabled} onChange={onChange}>
    <Input type="checkbox" name={name} id={name} checked={isChecked} disabled={isDisabled} />
    {label ? (
      <Label forwardedAs="label" htmlFor={name}>
        {label}
      </Label>
    ) : null}
  </Container>
);

export default Checkbox;
