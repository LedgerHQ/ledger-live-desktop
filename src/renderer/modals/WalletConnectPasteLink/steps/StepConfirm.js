// @flow
import React from "react";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

export default function StepConfirm({ account, link, setLink }: StepProps) {
  return <Box flow={1}>Paste</Box>;
}

export function StepConfirmFooter({ link, onClose }: StepProps) {
  return (
    <Box horizontal justifyContent="flex-end">
      <Button
        onClick={() => {
          onClose();
        }}
        outline
      >
        Reject
      </Button>
      <Box style={{ width: 10 }} />
      <Button
        onClick={() => {
          onClose();
        }}
        primary
      >
        Continue
      </Button>
    </Box>
  );
}
