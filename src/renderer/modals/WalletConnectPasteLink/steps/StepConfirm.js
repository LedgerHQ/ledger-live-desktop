// @flow
import React, { useContext } from "react";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { context, STATUS } from "~/renderer/screens/WalletConnect/Provider";

export default function StepConfirm({ account, link, setLink }: StepProps) {
  const wcContext = useContext(context);

  console.log(wcContext);

  return (
    <Box flow={1}>
      {wcContext.status === STATUS.ERROR ? (
        <Box>Error</Box>
      ) : wcContext.status === STATUS.CONNECTING && wcContext.dappInfo ? (
        <Box>{JSON.stringify(wcContext.dappInfo)}</Box>
      ) : (
        <Box>Loading</Box>
      )}
    </Box>
  );
}

export function StepConfirmFooter({ link, onClose }: StepProps) {
  const wcContext = useContext(context);

  return (
    <Box horizontal justifyContent="flex-end">
      {wcContext.status === STATUS.CONNECTING && wcContext.dappInfo ? (
        <Button
          onClick={() => {
            onClose();
          }}
          outline
        >
          Reject
        </Button>
      ) : null}
      <Box style={{ width: 10 }} />
      <Button
        onClick={() => {
          // should be onCloseWithoutDisconnect + approveSession
          onClose();
        }}
        primary
        disabled={!(wcContext.status === STATUS.CONNECTING && wcContext.dappInfo)}
      >
        Continue
      </Button>
    </Box>
  );
}
