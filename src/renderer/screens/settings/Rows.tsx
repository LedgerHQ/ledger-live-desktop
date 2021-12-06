import React from "react";
import styled from "styled-components";
import { Flex, Text } from "@ledgerhq/react-ui";

type SectionRowProps = {
  title?: React.ReactNode;
  desc: React.ReactNode;
  children?: any;
  onClick?: () => void;
  inset?: boolean;
};

const SectionRowContainer = styled(Flex)<{ inset: boolean }>`
  border-radius: ${p => (p.inset ? p.theme.radii[3] : 0)}px;
`;

export const SectionRow = ({ title, desc, children, onClick, inset = false }: SectionRowProps) => (
  <SectionRowContainer
    onClick={onClick}
    tabIndex={-1}
    justifyContent="space-between"
    alignItems="center"
    backgroundColor={inset ? "neutral.c30" : "unset"}
    p={inset ? 7 : 0}
    inset={inset}
  >
    <Flex flexDirection="column" flexGrow={1} flexShrink={1} mr={12} alignItems="start" rowGap={2}>
      {title && (
        <Text ff="Inter|SemiBold" color="palette.neutral.c100" fontSize={14}>
          {title}
        </Text>
      )}
      <Text fontSize={3} color="palette.neutral.c80" mt={1}>
        {desc}
      </Text>
    </Flex>
    <Flex>{children}</Flex>
  </SectionRowContainer>
);
