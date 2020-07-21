// @flow
import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/swap/types";
import StepSummary, { StepSummaryFooter } from "~/renderer/modals/Swap/steps/StepSummary";
import StepDevice from "~/renderer/modals/Swap/steps/StepDevice";
import StepFinished, { StepFinishedFooter } from "~/renderer/modals/Swap/steps/StepFinished";
import Breadcrumb from "~/renderer/components/Stepper/Breadcrumb";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import { useDispatch } from "react-redux";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import addToSwapHistory from "@ledgerhq/live-common/lib/swap/addToSwapHistory";

type SwapSteps = "summary" | "device" | "finished";
const SwapBody = ({
  swap,
  transaction,
  onClose,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  transaction: any, // FIXME
  onClose: any,
}) => {
  const [checkedDisclaimer, setCheckedDisclaimer] = useState(false);
  const [activeStep, setActiveStep] = useState<SwapSteps>("summary");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [result, setResult] = useState();
  const onAcceptTOS = useCallback(() => setActiveStep("device"), [setActiveStep]);
  const onSwitchAccept = useCallback(() => setCheckedDisclaimer(!checkedDisclaimer), [
    checkedDisclaimer,
  ]);

  const onDeviceInteraction = useCallback(
    result => {
      const { operation, swapId } = result;
      const account = swap.exchange.fromAccount;
      if (!account) return;
      dispatch(
        updateAccountWithUpdater(account.id, account =>
          addPendingOperation(
            addToSwapHistory(account, operation, transaction, swap, swapId),
            operation,
          ),
        ),
      );
      setResult(result);
      setActiveStep("finished");
    },
    [swap, transaction, dispatch],
  );

  const items = [
    { label: <Trans i18nKey={"swap.modal.steps.summary.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.device.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.finished.title"} /> },
  ];

  const errorSteps = error ? [1] : [];

  return (
    <ModalBody
      onClose={onClose}
      title={<Trans i18nKey="swap.modal.title" />}
      render={() => (
        <>
          <Breadcrumb
            mb={40}
            currentStep={["summary", "device", "finished"].indexOf(activeStep)}
            stepsErrors={errorSteps}
            items={items}
          />
          {error ? (
            <ErrorDisplay error={error} withExportLogs />
          ) : activeStep === "summary" ? (
            <StepSummary
              swap={swap}
              transaction={transaction}
              checkedDisclaimer={checkedDisclaimer}
              onSwitchAccept={onSwitchAccept}
            />
          ) : activeStep === "device" ? (
            <StepDevice
              swap={swap}
              transaction={transaction}
              onContinue={onDeviceInteraction}
              onError={setError}
            />
          ) : result && result.swapId ? (
            <StepFinished swapId={result.swapId} provider={swap.exchangeRate.provider} />
          ) : null}
        </>
      )}
      renderFooter={() =>
        activeStep === "summary" ? (
          <StepSummaryFooter
            onContinue={onAcceptTOS}
            onClose={onClose}
            disabled={!checkedDisclaimer}
          />
        ) : result && swap ? (
          <StepFinishedFooter result={result} swap={swap} onClose={onClose} />
        ) : null
      }
    />
  );
};

export default SwapBody;
