// @flow
import React from "react";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import IconCheckCircle from "~/renderer/icons/CheckCircle";
import Box from "~/renderer/components/Box";

const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 5,
  mt: 2,
}))`
  text-align: center;
  word-break: break-word;
`;

const Text: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 4,
  mt: 2,
}))`
  text-align: center;
`;

function SuccessDisplay({
  title,
  description,
  children,
}: {
  title: React$Node,
  description?: React$Node,
  children?: React$Node,
}) {
  const colors = useTheme("colors");
  return (
    <>
      <span style={{ color: colors.positiveGreen }}>
        <IconCheckCircle size={43} />
      </span>
      <Title>{title}</Title>

      <Text style={{ userSelect: "text" }} color="palette.text.shade80">
        {description}
      </Text>

      {children}
    </>
  );
}

export default SuccessDisplay;
