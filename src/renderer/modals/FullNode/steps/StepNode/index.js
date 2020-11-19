// @flow
import React, { useCallback, useEffect } from "react";
import { Trans } from "react-i18next";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import IconCheck from "~/renderer/icons/Check";
import IconCross from "~/renderer/icons/Cross";
import Form from "./Form";
import Button from "~/renderer/components/Button";
import BigSpinner from "~/renderer/components/BigSpinner";
import type { RPCNodeConfig } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import type { FullNodeSteps, ConnectionStatus } from "~/renderer/modals/FullNode";
import { CheckWrapper, CrossWrapper, connectionStatus } from "~/renderer/modals/FullNode";
import useEnv from "~/renderer/hooks/useEnv";
import { command } from "~/renderer/commands";

const Node = ({
  nodeConnectionStatus = connectionStatus.IDLE,
  nodeConfig,
  setNodeConfig,
  setNodeConnectionStatus,
  onStepChange,
  errors,
}: {
  nodeConnectionStatus: ConnectionStatus,
  nodeConfig: RPCNodeConfig,
  setNodeConfig: any => void,
  setNodeConnectionStatus: ConnectionStatus => void,
  onStepChange: FullNodeSteps => void,
  errors: any,
}) => {
  useEffect(() => {
    if (nodeConnectionStatus === connectionStatus.PENDING) {
      command("checkRPCNodeConfig")(nodeConfig).subscribe({
        complete: () => setNodeConnectionStatus(connectionStatus.SUCCESS),
        error: () => setNodeConnectionStatus(connectionStatus.FAILURE),
      });
    }
  }, [nodeConfig, nodeConnectionStatus, setNodeConnectionStatus]);

  return (
    <Box>
      {nodeConnectionStatus === connectionStatus.IDLE ? (
        <Form patchNodeConfig={setNodeConfig} errors={errors} nodeConfig={nodeConfig} />
      ) : nodeConnectionStatus === connectionStatus.PENDING ? (
        <Box alignItems="center">
          <BigSpinner size={50} />
          <Text
            ff="Inter|SemiBold"
            textAlign={"center"}
            mt={32}
            fontSize={6}
            color="palette.text.shade100"
          >
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.connecting.header" />
          </Text>
          <Text
            ff="Inter|Regular"
            mt={2}
            textAlign={"center"}
            fontSize={3}
            color="palette.text.shade50"
          >
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.connecting.description" />
          </Text>
        </Box>
      ) : nodeConnectionStatus === connectionStatus.SUCCESS ? (
        <Box alignItems="center">
          <CheckWrapper size={50}>
            <IconCheck size={20} />
          </CheckWrapper>
          <Text
            ff="Inter|SemiBold"
            textAlign={"center"}
            mt={32}
            fontSize={6}
            color="palette.text.shade100"
          >
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.success.header" />
          </Text>
          <Text
            ff="Inter|Regular"
            mt={2}
            textAlign={"center"}
            fontSize={3}
            color="palette.text.shade50"
          >
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.success.description" />
          </Text>
        </Box>
      ) : (
        <Box alignItems="center">
          <CrossWrapper size={50}>
            <IconCross size={20} />
          </CrossWrapper>
          <Text
            ff="Inter|SemiBold"
            textAlign={"center"}
            mt={32}
            fontSize={6}
            color="palette.text.shade100"
          >
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.failure.header" />
          </Text>
          <Text
            ff="Inter|Regular"
            mt={2}
            textAlign={"center"}
            fontSize={3}
            color="palette.text.shade50"
          >
            <Trans i18nKey="fullNode.modal.steps.node.connectionSteps.failure.description" />
          </Text>
        </Box>
      )}
    </Box>
  );
};

export const StepNodeFooter = ({
  onClose,
  onStepChange,
  validNodeConfig,
  nodeConnectionStatus = connectionStatus.IDLE,
  setNodeConnectionStatus,
}: {
  onClose: () => void,
  onStepChange: FullNodeSteps => void,
  validNodeConfig: boolean,
  nodeConnectionStatus: ConnectionStatus,
  setNodeConnectionStatus: ConnectionStatus => void,
}) => {
  const satStackAlreadyConfigured = useEnv("SATSTACK");
  const continueEnabled =
    (validNodeConfig &&
      (nodeConnectionStatus === connectionStatus.IDLE ||
        nodeConnectionStatus === connectionStatus.FAILURE)) ||
    nodeConnectionStatus === connectionStatus.SUCCESS;

  const onContinue = useCallback(() => {
    if (nodeConnectionStatus === connectionStatus.IDLE) {
      // Try to connect
      setNodeConnectionStatus(connectionStatus.PENDING);
    } else if (nodeConnectionStatus === connectionStatus.SUCCESS) {
      // Success
      onStepChange("accounts");
    } else if (nodeConnectionStatus === connectionStatus.FAILURE) {
      // Retry
      setNodeConnectionStatus(connectionStatus.PENDING);
    }
  }, [nodeConnectionStatus, onStepChange, setNodeConnectionStatus]);

  const showDisconnect =
    satStackAlreadyConfigured && nodeConnectionStatus === connectionStatus.IDLE;

  return (
    <Box
      horizontal
      flex={showDisconnect ? 1 : undefined}
      alignItems={showDisconnect ? "flex-start" : "flex-end"}
    >
      {showDisconnect ? (
        <Box flex={1}>
          <Button danger onClick={() => onStepChange("disconnect")} style={{ marginRight: "auto" }}>
            <Trans i18nKey="fullNode.disconnect" />
          </Button>
        </Box>
      ) : null}
      {nodeConnectionStatus === connectionStatus.FAILURE ? (
        <>
          <Button
            outlineGrey
            secondary
            onClick={() => setNodeConnectionStatus(connectionStatus.IDLE)}
            mr={3}
          >
            <Trans i18nKey="fullNode.checkNodeSettings" />
          </Button>
          <Button primary onClick={onContinue} disabled={!continueEnabled}>
            <Trans i18nKey={"common.retry"} />
          </Button>
        </>
      ) : (
        <>
          <Button secondary onClick={onClose} mr={3}>
            <Trans i18nKey="common.cancel" />
          </Button>
          <Button primary onClick={onContinue} disabled={!continueEnabled}>
            <Trans i18nKey={"common.continue"} />
          </Button>
        </>
      )}
    </Box>
  );
};

export default Node;
