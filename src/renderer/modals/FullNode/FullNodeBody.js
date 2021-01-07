// @flow
import React, { useMemo, useEffect, useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { validateRPCNodeConfig } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import type { RPCNodeConfig } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import { ModalBody } from "~/renderer/components/Modal";
import TrackPage from "~/renderer/analytics/TrackPage";
import Breadcrumb from "~/renderer/components/Stepper/Breadcrumb";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import StepLanding, { StepLandingFooter } from "./steps/StepLanding";
import StepNode, { StepNodeFooter } from "./steps/StepNode";
import StepAccounts, { StepAccountsFooter } from "./steps/StepAccounts";
import StepConnectDevice, { StepDeviceFooter } from "./steps/StepConnectDevice";
import StepSatStack, { StepSatStackFooter } from "./steps/StepSatStack";
import StepDisconnect, { StepDisconnectFooter } from "./steps/StepDisconnect";
import type { FullNodeSteps, ConnectionStatus } from "~/renderer/modals/FullNode";
import { connectionStatus } from "~/renderer/modals/FullNode";
import useEnv from "~/renderer/hooks/useEnv";
import { loadLSS, saveLSS } from "~/renderer/storage";

const steps = ["landing", "node", "accounts", "device", "satstack", "disconnect"];
const FullNodeBody = ({
  onClose,
  onStepChange,
  activeStep,
}: {
  onClose: any,
  onStepChange: FullNodeSteps => void,
  activeStep: FullNodeSteps,
}) => {
  const [errors, setErrors] = useState(null);
  const [error, setError] = useState(null);
  const [errorStep, setErrorStep] = useState(null);
  const satStackAlreadyConfigured = useEnv("SATSTACK");
  const [satStackDownloaded, setSatStackDownloaded] = useState(false);

  const [nodeConnectionStatus, setNodeConnectionStatus] = useState<ConnectionStatus>(
    connectionStatus.IDLE,
  );
  const items = [
    { label: <Trans i18nKey={"fullNode.modal.steps.node.title"} /> },
    { label: <Trans i18nKey={"fullNode.modal.steps.accounts.title"} /> },
    { label: <Trans i18nKey={"fullNode.modal.steps.device.title"} /> },
    { label: <Trans i18nKey={"fullNode.modal.steps.satstack.title"} /> },
  ];

  const [numberOfAccountsToScan, setNumberOfAccountsToScan] = useState<?number>(10);
  const [nodeConfig, setNodeConfig] = useState<RPCNodeConfig>({
    host: "127.0.0.1:8332",
    username: "",
    password: "",
    notls: false,
  });
  const [scannedDescriptors, setScannedDescriptors] = useState();
  const patchNodeConfig = useCallback(
    (patch: $Shape<RPCNodeConfig>) => setNodeConfig({ ...nodeConfig, ...patch }),
    [nodeConfig],
  );

  const errorSteps = error && errorStep ? [errorStep] : [];
  const showBreadcrumb = !["landing", "disconnect"].includes(activeStep);
  const stepIndex = steps.indexOf(activeStep) - 1;

  const onAcceptLanding = useCallback(() => onStepChange("node"), [onStepChange]);

  const validNodeConfig = useMemo(() => {
    const errors = validateRPCNodeConfig(nodeConfig);
    setErrors(errors);
    return !errors.length;
  }, [nodeConfig]);

  useEffect(() => {
    // Prefill the node data for edit?
    async function prefill() {
      if (satStackAlreadyConfigured) {
        const maybeLSSConfig = await loadLSS();
        if (maybeLSSConfig && maybeLSSConfig.node) {
          setNodeConfig(maybeLSSConfig.node);
        }
      }
    }
    prefill();
  }, [satStackAlreadyConfigured]);

  useEffect(() => {
    if (scannedDescriptors) {
      saveLSS({ node: nodeConfig, accounts: scannedDescriptors }).catch(e => {
        setError(e);
        setErrorStep(2);
      });
    }
  }, [nodeConfig, scannedDescriptors]);

  return (
    <ModalBody
      onClose={onClose}
      title={
        activeStep === "disconnect" ? (
          <Trans i18nKey="fullNode.modal.disconnectTitle" />
        ) : (
          <Trans i18nKey="fullNode.modal.title" />
        )
      }
      render={() => (
        <>
          <TrackPage category="FullNode" name={`ModalStep-${activeStep}`} />
          {showBreadcrumb ? (
            <Breadcrumb mb={40} currentStep={stepIndex} stepsErrors={errorSteps} items={items} />
          ) : null}
          {error ? (
            <ErrorDisplay error={error} withExportLogs />
          ) : activeStep === "landing" ? (
            <StepLanding />
          ) : activeStep === "node" ? (
            <StepNode
              errors={errors}
              nodeConfig={nodeConfig}
              setNodeConfig={patchNodeConfig}
              nodeConnectionStatus={nodeConnectionStatus}
              setNodeConnectionStatus={setNodeConnectionStatus}
              onStepChange={onStepChange}
            />
          ) : activeStep === "accounts" ? (
            <StepAccounts
              numberOfAccountsToScan={numberOfAccountsToScan}
              setNumberOfAccountsToScan={setNumberOfAccountsToScan}
            />
          ) : activeStep === "device" ? (
            <StepConnectDevice
              setError={setError}
              onStepChange={onStepChange}
              nodeConfig={nodeConfig}
              setScannedDescriptors={setScannedDescriptors}
              numberOfAccountsToScan={numberOfAccountsToScan || 10}
            />
          ) : activeStep === "satstack" ? (
            <StepSatStack satStackDownloaded={satStackDownloaded} />
          ) : (
            <StepDisconnect />
          )}
        </>
      )}
      renderFooter={() =>
        activeStep === "landing" ? (
          <StepLandingFooter onClose={onClose} onContinue={onAcceptLanding} />
        ) : activeStep === "node" ? (
          <StepNodeFooter
            onClose={onClose}
            onStepChange={onStepChange}
            validNodeConfig={validNodeConfig}
            nodeConnectionStatus={nodeConnectionStatus}
            setNodeConnectionStatus={setNodeConnectionStatus}
          />
        ) : activeStep === "accounts" ? (
          <StepAccountsFooter
            numberOfAccountsToScan={numberOfAccountsToScan}
            onStepChange={onStepChange}
          />
        ) : activeStep === "device" ? (
          <StepDeviceFooter
            onClose={onClose}
            onStepChange={onStepChange}
            scannedDescriptors={scannedDescriptors}
          />
        ) : activeStep === "satstack" ? (
          <StepSatStackFooter
            satStackDownloaded={satStackDownloaded}
            setSatStackDownloaded={setSatStackDownloaded}
            onClose={onClose}
          />
        ) : (
          <StepDisconnectFooter onClose={onClose} />
        )
      }
    />
  );
};

export default FullNodeBody;
