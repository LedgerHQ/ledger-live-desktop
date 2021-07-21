// @flow
import React from "react";
import Text from "~/renderer/components/Text";

export function FormLabel({ children }: { children?: React$Node }) {
  return (
    <Text uppercase fontWeight="600">
      {children}
    </Text>
  );
}
