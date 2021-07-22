// @flow
import React, { useContext } from "react";
import TextBase from "~/renderer/components/Text";
import ButtonBase from "~/renderer/components/Button";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { FormSummarySectionContext } from "./SummarySection";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.375rem;
  align-items: end;
  color: ${p => p.theme.colors.palette.text.shade100};
`;
const Text: ThemedComponent<{}> = styled(TextBase).attrs(() => ({
  ff: "Inter",
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: "1.4",
}))`
  display: inline-flex;
  column-gap: 0.7rem;
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

const ButtonEdit = ({ onClick }: { onClick: Function }) => {
  if (!onClick) return null;

  return <Button onClick={onClick}>Edit</Button>;
};

// This component fetch the current value, the optional icon and the handleChange function
// from the section's context and render them if possible
const SummaryValue = () => {
  const { value, handleChange, Icon } = useContext(FormSummarySectionContext);

  if (!value) return <Text>-</Text>;

  return (
    <Container>
      {Icon ? <Icon /> : null}
      <Text>{value}</Text>
      <ButtonEdit onClick={handleChange} />
    </Container>
  );
};

export default SummaryValue;
