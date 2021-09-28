//  @flow
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { log } from "@ledgerhq/logs";
import type { DeviceModelId } from "@ledgerhq/devices";
import { UserRefusedFirmwareUpdate } from "@ledgerhq/errors";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { hasFinalFirmware } from "@ledgerhq/live-common/lib/hw/hasFinalFirmware";
import logger from "~/logger";
import Modal from "~/renderer/components/Modal";
import Stepper from "~/renderer/components/Stepper";
import type { Step as TypedStep } from "~/renderer/components/Stepper";
import type { ModalStatus } from "~/renderer/screens/manager/FirmwareUpdate/types";
import StepResetDevice, { StepResetFooter } from "./steps/00-step-reset-device";
import StepFullFirmwareInstall from "./steps/01-step-install-full-firmware";
import StepFlashMcu from "./steps/02-step-flash-mcu";
import StepUpdating from "./steps/02-step-updating";
import StepConfirmation, { StepConfirmFooter } from "./steps/03-step-confirmation";

type MaybeError = ?Error;

export type StepProps = {
  firmware: FirmwareUpdateContext,
  appsToBeReinstalled: boolean,
  onCloseModal: (proceedToAppReinstall?: boolean) => void,
  error: ?Error,
  setError: Error => void,
  device: Device,
  deviceModelId: DeviceModelId,
  deviceInfo: DeviceInfo,
  t: TFunction,
  transitionTo: string => void,
  onRetry: () => void,
};

export type StepId = "idCheck" | "updateMCU" | "updating" | "finish" | "resetDevice";

type Step = TypedStep<StepId, StepProps>;

type Props = {
  withResetStep: boolean,
  withAppsToReinstall: boolean,
  status: ModalStatus,
  onClose: (proceedToAppReinstall?: boolean) => void,
  firmware: ?FirmwareUpdateContext,
  stepId: StepId,
  error: ?Error,
  deviceModelId: DeviceModelId,
  deviceInfo: DeviceInfo,
  setFirmwareUpdateOpened: boolean => void,
};

const HookMountUnmount = ({ onMountUnmount }: { onMountUnmount: boolean => void }) => {
  useEffect(() => {
    onMountUnmount(true);
    return () => onMountUnmount(false);
  }, [onMountUnmount]);
  return null;
};

const UpdateModal = ({
  stepId,
  deviceModelId,
  withResetStep,
  withAppsToReinstall,
  error,
  status,
  onClose,
  firmware,
  setFirmwareUpdateOpened,
  ...props
}: Props) => {
  const [stateStepId, setStateStepId] = useState<StepId>(stepId);
  const [err, setErr] = useState<MaybeError>(error || null);
  const [nonce, setNonce] = useState(0);
  const { t } = useTranslation();
  const withFinal = useMemo(() => hasFinalFirmware(firmware?.final), [firmware]);

  const createSteps = useCallback(
    ({ withResetStep }: { withResetStep: boolean }) => {
      const updateStep = {
        id: "idCheck",
        label: firmware?.osu?.hash ? t("manager.modal.identifier") : t("manager.modal.preparation"),
        component: StepFullFirmwareInstall,
        onBack: null,
        hideFooter: true,
      };

      const finalStep = {
        id: "finish",
        label: t("addAccounts.breadcrumb.finish"),
        component: StepConfirmation,
        footer: StepConfirmFooter,
        onBack: null,
        hideFooter: false,
      };

      const mcuStep = {
        id: "updateMCU",
        label: t("manager.modal.steps.updateMCU"),
        component: StepFlashMcu,
        onBack: null,
        hideFooter: true,
      };

      const updatingStep = {
        id: "updating",
        label: t("manager.modal.steps.updating"),
        component: StepUpdating,
        onBack: null,
        hideFooter: true,
      };

      const resetStep = {
        id: "resetDevice",
        label: t("manager.modal.steps.reset"),
        component: StepResetDevice,
        footer: StepResetFooter,
        onBack: null,
        hideFooter: false,
      };

      const steps = [];
      if (withResetStep) {
        steps.push(resetStep);
      }
      steps.push(updateStep);
      if (firmware?.shouldFlashMCU || withFinal) {
        steps.push(mcuStep);
      } else {
        steps.push(updatingStep);
      }
      steps.push(finalStep);
      return steps;
    },
    [t, firmware, withFinal],
  );

  const steps = useMemo(() => createSteps({ withResetStep }), [createSteps, withResetStep]);
  const stepsId = steps.map(step => step.id);
  const errorSteps = err ? [stepsId.indexOf(stateStepId)] : [];

  const setError = useCallback(
    (e: Error) => {
      logger.critical(e);
      setErr(e);
    },
    [setErr],
  );

  const handleReset = useCallback(() => {
    setErr(null);
    setStateStepId(steps[0].id);
    setNonce(curr => curr++);
  }, [steps]);

  const handleStepChange = useCallback((step: Step) => {
    setStateStepId(step.id);
  }, []);

  useEffect(() => {
    log("firmware-record-start");

    return () => {
      log("firmware-record-cancel");
    };
  }, []);

  const additionalProps = {
    ...props,
    appsToBeReinstalled: withAppsToReinstall,
    onCloseModal: onClose,
    setError,
    firmware,
    error: err,
    deviceModelId,
    onRetry: handleReset,
  };

  return (
    <Modal
      width={550}
      onClose={() => onClose()}
      centered
      backdropColor
      onHide={handleReset}
      isOpened={status === "install"}
      refocusWhenChange={stateStepId}
      preventBackdropClick={!["finish", "resetDevice"].includes(stepId) && !error}
      render={() => (
        <Stepper
          {...additionalProps}
          key={nonce}
          onStepChange={handleStepChange}
          title={t("manager.firmware.update")}
          stepId={stateStepId}
          steps={steps}
          errorSteps={errorSteps}
          deviceModelId={deviceModelId}
          onClose={() => onClose()}
          hideCloseButton={
            stepId === "finish" && !!error && error instanceof UserRefusedFirmwareUpdate
          }
        >
          <HookMountUnmount onMountUnmount={setFirmwareUpdateOpened} />
        </Stepper>
      )}
    />
  );
};
export default UpdateModal;
