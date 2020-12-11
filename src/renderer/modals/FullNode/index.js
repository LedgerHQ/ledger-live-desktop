// @flow

import React, { useState } from "react";
import Modal from "~/renderer/components/Modal";
import FullNodeBody from "~/renderer/modals/FullNode/FullNodeBody";
import styled from "styled-components";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import useEnv from "~/renderer/hooks/useEnv";

export type FullNodeSteps = "landing" | "node" | "device" | "accounts" | "satstack" | "disconnect";
export const connectionStatus = Object.freeze({
  IDLE: "idle",
  PENDING: "pending",
  SUCCESS: "success",
  FAILURE: "failure",
});
export type ConnectionStatus = $Values<typeof connectionStatus>;

export const CheckWrapper: ThemedComponent<{
  size?: number,
}> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  border-radius: ${p => p.size}px;
  background-color: ${p => rgba(p.theme.colors.positiveGreen, 0.2)};
  color: ${p => p.theme.colors.positiveGreen};
`;

export const CrossWrapper: ThemedComponent<{
  size: number,
}> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  border-radius: ${p => p.size}px;
  background-color: ${p => rgba(p.theme.colors.alertRed, 0.2)};
  color: ${p => p.theme.colors.alertRed};
`;

const FullNode = () => {
  const satStackAlreadyConfigured = useEnv("SATSTACK");
  const [stepId, setStepId] = useState(satStackAlreadyConfigured ? "node" : "landing");

  return (
    <Modal
      name="MODAL_FULL_NODE"
      centered
      preventBackdropClick
      render={({ data, onClose }) => (
        <FullNodeBody
          onStepChange={setStepId}
          activeStep={data?.skipNodeSetup ? "accounts" : stepId}
          onClose={onClose}
        />
      )}
    />
  );
};

export default FullNode;
