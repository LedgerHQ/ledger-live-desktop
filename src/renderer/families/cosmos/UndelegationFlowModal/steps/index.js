// @flow
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import GenericStepConnectDevice from "~/renderer/modals/Send/steps/GenericStepConnectDevice";
import StepAmount from "./Amount";
import StepConfirmation from "./Confirmation";
import type { StepProps, St } from "../types";

export function useSteps(): St[] {
  const { t } = useTranslation();

  return useMemo<St[]>(
    () => [
      {
        id: "amount",
        label: t("cosmos.undelegation.flow.steps.amount.title"),
        component: StepAmount,
        noScroll: true,
        // footer: StepDelegationFooter,
      },
      {
        id: "device",
        label: t("cosmos.delegation.flow.steps.connectDevice.title"),
        component: GenericStepConnectDevice,
        onBack: ({ transitionTo }: StepProps) => transitionTo("amount"),
      },
      {
        id: "confirmation",
        label: t("cosmos.delegation.flow.steps.confirmation.title"),
        component: StepConfirmation,
        // footer: StepConfirmationFooter,
      },
    ],
    [t],
  );
}
