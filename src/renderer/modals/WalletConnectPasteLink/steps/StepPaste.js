// @flow
import React from "react";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

export default function StepPaste({ account, link, setLink }: StepProps) {
  return <Box flow={1}>Paste</Box>;
}

export function StepPasteFooter({ link, transitionTo }: StepProps) {
  return (
    <Box horizontal justifyContent="flex-end">
      <Button
        onClick={() => {
          transitionTo("confirm");
        }}
        primary
        disabled={!!link}
      >
        Continue
      </Button>
    </Box>
  );
}
