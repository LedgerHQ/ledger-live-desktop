import React from "react";
import styled from "styled-components";
import Text from "@ui/components/Text";
import Flex from "@ui/components/Layout/Flex";

const Container = styled(Flex).attrs({ alignItems: "center", flexDirection: "row" })`
  width: fit-content;
  column-gap: 12px;
  cursor: pointer;

  /* reversed VARIANT */
  &[data-reversed="true"] {
    flex-direction: row-reverse;
  }

  &[data-disabled="true"] {
    cursor: unset;
  }
`;

const Input = styled.input`
  position: absolute;
  visibility: hidden;
`;

const Label = styled(Text).attrs({ type: "body", fontWeight: "500" })`
  color: currentColor;

  &:first-letter {
    text-transform: uppercase;
  }

  /* CHECKED VARIANT */
  ${Input}:checked ~ & {
    color: ${(props) => props.theme.colors.palette.primary.c160};
  }
`;

const Switcher = styled.div`
  --ll-switch-width: 48px;
  --ll-switch-height: 28px;
  --ll-switch-padding: 4px;

  position: relative;
  display: inline-block;

  background: ${(props) => props.theme.colors.palette.neutral.c90};
  border-radius: 16px;
  width: var(--ll-switch-width);
  height: var(--ll-switch-height);

  transition: background 200ms;

  &:before,
  &:after {
    content: "";
  }

  &:focus {
    outline-style: auto;
    outline: 1px solid ${(props) => props.theme.colors.palette.neutral.c90};
    outline-offset: 2px;
  }

  /* CIRCLE ELEMENT */
  &:before {
    position: absolute;
    display: block;
    background: ${(props) => props.theme.colors.palette.neutral.c00};
    border-radius: 40px;

    width: calc(calc(var(--ll-switch-width) / 2) - var(--ll-switch-padding));
    height: calc(calc(var(--ll-switch-width) / 2) - var(--ll-switch-padding));
    top: var(--ll-switch-padding);
    transform: translateX(var(--ll-switch-padding));
    transition: transform 0.25s;
  }

  /* SMALL VARIANT */
  &[data-size="small"] {
    --ll-switch-width: 24px;
    --ll-switch-height: 16px;
  }

  /* CHECKED VARIANT */
  ${Input}:checked ~ & {
    background: ${(props) => props.theme.colors.palette.primary.c160};

    &:before {
      transform: translateX(calc(var(--ll-switch-width) / 2));
    }
  }
`;

export type SwitchProps = {
  name: string;
  checked: boolean;
  onChange: (e: React.FormEvent<HTMLDivElement>) => void;
  size?: "normal" | "small";
  label?: string;
  disabled?: boolean;
  reversed?: boolean;
};

const Switch = ({
  name,
  checked,
  onChange,
  label,
  disabled,
  reversed,
  size,
}: SwitchProps): JSX.Element => {
  const handleFocusKeyDown = (e: React.FormEvent<HTMLDivElement> & { key: string }) => {
    if (e.key.match(/enter/i)) onChange(e);
  };

  const handleClick = (e: React.FormEvent<HTMLDivElement>) => {
    if (!disabled) onChange(e);
  };

  return (
    <Container
      role="button"
      data-reversed={reversed}
      data-disabled={disabled}
      onClick={handleClick}
      tabIndex={0}
      aria-pressed={checked}
      onKeyDown={handleFocusKeyDown}
    >
      <Input type="checkbox" name={name} id={name} disabled={disabled} checked={checked} />
      <Switcher data-size={size} />
      {label ? <Label>{label}</Label> : null}
    </Container>
  );
};

export default Switch;
