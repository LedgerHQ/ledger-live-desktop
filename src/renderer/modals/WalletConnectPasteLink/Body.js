// @flow
import React, { useCallback, useState } from "react";
import type { Account } from "@ledgerhq/live-common/lib/types";
import Track from "~/renderer/analytics/Track";
import { Trans, useTranslation } from "react-i18next";
import StepPaste, { StepPasteFooter } from "./steps/StepPaste";
import StepConfirm, { StepConfirmFooter } from "./steps/StepConfirm";
import type { St, StepProps } from "./types";
import Stepper from "~/renderer/components/Stepper";
import { disconnect } from "~/renderer/screens/WalletConnect/Provider";

type OwnProps = {|
  onClose: () => void,
  data: {
    account: Account,
  },
|};

type Props = OwnProps;

const steps: Array<St> = [
  {
    id: "paste",
    label: <Trans i18nKey="walletconnect.steps.paste.title" />,
    component: StepPaste,
    footer: StepPasteFooter,
  },
  {
    id: "confirm",
    label: <Trans i18nKey="walletconnect.steps.confirm.title" />,
    component: StepConfirm,
    footer: StepConfirmFooter,
    onBack: ({ transitionTo }: StepProps) => {
      disconnect();
      transitionTo("paste");
    },
  },
];

const Body = ({ onClose, data }: Props) => {
  const { t } = useTranslation();
  const [link, setLink] = useState();
  const [stepId, setStepId] = useState("paste");

  const handleStepChange = useCallback(e => setStepId(e.id), [setStepId]);

  const stepperProps = {
    title: t("walletconnect.titleAccount"),
    account: data.account,
    onClose: () => {
      disconnect();
      onClose();
    },
    onCloseWithoutDisconnect: onClose,
    onStepChange: handleStepChange,
    stepId,
    steps,
    link,
    setLink,
  };

  return (
    <Stepper {...stepperProps}>
      <Track onUnmount event="CloseModalWalletConnectPasteLink" />
    </Stepper>
  );
};

export default Body;
