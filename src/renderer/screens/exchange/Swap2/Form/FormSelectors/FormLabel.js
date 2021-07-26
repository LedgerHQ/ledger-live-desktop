// @flow
import React from "react";
import Text from "~/renderer/components/Text";

export function FormLabel({ children }: { children?: React$Node }) {
  return (
    <Text ff="Inter|SemiBold" color="palette.text.shade50" fontWeight="600">
      {children}
    </Text>
  );
}
