import React from "react";
import { Flex, Text } from "@ledgerhq/react-ui";
import { Column } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";

type SectionRowProps = {
  title?: React.ReactNode;
  desc: React.ReactNode;
  children?: any;
  onClick?: () => void;
  inset?: boolean;
};

export const SectionRow = ({ title, desc, children, onClick, inset = false }: SectionRowProps) => (
  // todo copy sqtyles from settings sectrion row container handling inset prop
  <Flex onClick={onClick} tabIndex={-1} justifyContent="space-between">
    <Flex flexDirection="column" flexGrow={1} flexShrink={1} mr={12}>
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
  </Flex>
);
