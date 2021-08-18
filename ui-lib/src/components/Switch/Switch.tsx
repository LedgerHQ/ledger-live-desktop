import React from "react";
import styled from "styled-components";
import Text from "@ui/components/Text";
import Flex from "@ui/components/Layout/Flex";

const Container = styled(Flex).attrs({ alignItems: "center", flexDirection: "row" })`
  width: fit-content;
  column-gap: 12px;

  /* reversed VARIANT */
  &[data-reversed="true"] {
    flex-direction: row-reverse;
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
    color: ${props => props.theme.colors.palette.v2.primary.dark};
  }
`;

const Switcher = styled.div`
  --ll-switch-width: 48px;
  --ll-switch-height: 28px;
  --ll-switch-padding: 4px;

  position: relative;
  display: inline-block;

  background: ${props => props.theme.colors.palette.v2.grey.border};
  border-radius: 16px;
  width: var(--ll-switch-width);
  height: var(--ll-switch-height);

  transition: background 200ms;
  cursor: pointer;

  &:before,
  &:after {
    content: "";
  }

  &:focus {
    outline-style: auto;
    outline: 1px solid ${props => props.theme.colors.palette.v2.grey.border};
    outline-offset: 2px;
  }

  /* CIRCLE ELEMENT */
  &:before {
    position: absolute;
    display: block;
    background: ${props => props.theme.colors.palette.v2.background.default};
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
    background: ${props => props.theme.colors.palette.v2.primary.dark};

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

  return (
    <Container data-reversed={reversed}>
      <Input
        type="checkbox"
        name={name}
        id={name}
        disabled={disabled}
        checked={checked}
        onChange={() => {}}
      />
      <Switcher
        role="button"
        onClick={onChange}
        data-size={size}
        tabIndex={0}
        onKeyDown={handleFocusKeyDown}
        aria-pressed={checked}
      />
      {label ? (
        <Label forwardedAs="label" htmlFor={name}>
          {label}
        </Label>
      ) : null}
    </Container>
  );
};

export default Switch;
