// @flow
import React from "react";
import TextBase from "~/renderer/components/Text";
import ButtonBase from "~/renderer/components/Button";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.375rem;
  align-items: center;
  color: ${p => p.theme.colors.palette.text.shade100};
`;
const Text: ThemedComponent<{}> = styled(TextBase).attrs(() => ({
  ff: "Inter",
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: "1.4",
}))`
  display: inline-block;
  color: ${p => p.theme.colors.palette.secondary.main};

  &:first-letter {
    text-transform: uppercase;
  }
`;
const Button: ThemedComponent<{}> = styled(ButtonBase).attrs(() => ({
  color: "palette.primary.main",
}))`
  padding: 0;
  height: unset;
`;

export const NoValuePlaceholder = () => (
  <TextBase color="palette.text.shade40" mr={3} fontSize={4} fontWeight={600}>
    {"-"}
  </TextBase>
);

const SummaryValue = ({
  value,
  handleChange,
  children,
}: {
  value?: string,
  handleChange?: Function,
  children?: React$Node,
}) => {
  return (
    <Container>
      {children}
      {value && <Text>{value}</Text>}
      {handleChange ? <Button onClick={handleChange}>Edit</Button> : null}
    </Container>
  );
};

export default SummaryValue;
