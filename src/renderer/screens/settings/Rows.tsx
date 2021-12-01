import React from "react";
import styled from "styled-components";
import { openURL } from "~/renderer/linking";
import { Flex, Text, Link, Icons } from "@ledgerhq/react-ui";

type SectionRowProps = {
  title?: React.ReactNode;
  desc: React.ReactNode;
  children?: any;
  linkLabel?: string;
  linkHref?: string;
  onClick?: () => void;
  inset?: boolean;
};

const SectionRowContainer = styled(Flex)<{ inset: boolean }>`
  border-radius: ${p => (p.inset ? p.theme.radii[3] : 0)}px;
`;

export const SectionRow = ({
  title,
  desc,
  children,
  onClick,
  inset = false,
  linkHref,
  linkLabel,
}: SectionRowProps) => (
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
      {linkLabel && linkHref && (
        <Link
          href={linkHref}
          iconPosition="right"
          type="main"
          size="medium"
          alwaysUnderline
          Icon={Icons.ExternalLinkMedium}
          onClick={e => {
            e.preventDefault();
            openURL(linkHref);
          }}
        >
          {linkLabel}
        </Link>
      )}
    </Flex>
    <Flex>{children}</Flex>
  </SectionRowContainer>
);
