// @flow
import React from "react";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

export default function StepSummary({ account, message }: StepProps) {
  return (
    <Box flow={1}>
      <Text>{account?.name}</Text>
      <Text>{message.message.domain ? JSON.stringify(message.message) : message.message}</Text>
    </Box>
  );
}

export function StepSummaryFooter({ transitionTo }: StepProps) {
  return (
    <Box horizontal justifyContent="flex-end">
      <Button
        onClick={() => {
          transitionTo("sign");
        }}
        primary
      >
        Continue
      </Button>
    </Box>
  );
}
