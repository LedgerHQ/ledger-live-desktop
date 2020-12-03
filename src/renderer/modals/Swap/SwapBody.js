// @flow
import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import StepSummary, { StepSummaryFooter } from "~/renderer/modals/Swap/steps/StepSummary";
import StepDevice, { StepDeviceFooter } from "~/renderer/modals/Swap/steps/StepDevice";
import StepFinished, { StepFinishedFooter } from "~/renderer/modals/Swap/steps/StepFinished";
import Breadcrumb from "~/renderer/components/Stepper/Breadcrumb";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import { useDispatch } from "react-redux";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { addPendingOperation, getMainAccount } from "@ledgerhq/live-common/lib/account";
import addToSwapHistory from "@ledgerhq/live-common/lib/exchange/swap/addToSwapHistory";
import TrackPage from "~/renderer/analytics/TrackPage";
import Track from "~/renderer/analytics/Track";

type SwapSteps = "summary" | "device" | "finished";
const SwapBody = ({
  swap,
  transaction,
  onClose,
  onStepChange,
  onCompleteSwap,
  activeStep,
  ratesExpiration,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  transaction: any, // FIXME
  onClose: any,
  onStepChange: SwapSteps => void,
  onCompleteSwap: () => void,
  activeStep: SwapSteps,
  ratesExpiration: Date,
}) => {
  const { exchange } = swap;
  const { fromAccount, fromParentAccount } = exchange;
  const [checkedDisclaimer, setCheckedDisclaimer] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [result, setResult] = useState();
  const onAcceptTOS = useCallback(() => onStepChange("device"), [onStepChange]);
  const onSwitchAccept = useCallback(() => setCheckedDisclaimer(!checkedDisclaimer), [
    checkedDisclaimer,
  ]);

  const onDeviceInteraction = useCallback(
    result => {
      const { operation, swapId } = result;
      const mainAccount = getMainAccount(fromAccount, fromParentAccount);

      if (!mainAccount) return;
      dispatch(
        updateAccountWithUpdater(mainAccount.id, account =>
          addPendingOperation(
            addToSwapHistory({
              account,
              operation,
              transaction,
              swap,
              swapId,
            }),
            operation,
          ),
        ),
      );
      setResult(result);
      onStepChange("finished");
      onCompleteSwap();
    },
    [dispatch, fromAccount, fromParentAccount, onCompleteSwap, onStepChange, swap, transaction],
  );

  const items = [
    { label: <Trans i18nKey={"swap.modal.steps.summary.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.device.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.finished.title"} /> },
  ];

  const errorSteps = error ? [1] : [];

  return (
    <ModalBody
      onClose={locked && !error ? undefined : onClose}
      title={<Trans i18nKey="swap.modal.title" />}
      render={() => (
        <>
          <TrackPage key={activeStep} category="Swap" name={`ModalStep-${activeStep}`} />
          <Breadcrumb
            mb={40}
            currentStep={["summary", "device", "finished"].indexOf(activeStep)}
            stepsErrors={errorSteps}
            items={items}
          />
          {error ? (
            <>
              <Track key={error.name} onMount event={`SwapModalError-${error.name}`} />
              <ErrorDisplay error={error} />
            </>
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
              setLocked={setLocked}
              transaction={transaction}
              onContinue={onDeviceInteraction}
              onError={setError}
            />
          ) : result && result.swapId ? (
            <StepFinished
              setLocked={setLocked}
              swapId={result.swapId}
              provider={swap.exchangeRate.provider}
            />
          ) : null}
        </>
      )}
      renderFooter={() =>
        error ? (
          <StepDeviceFooter onClose={onClose} />
        ) : activeStep === "summary" ? (
          <StepSummaryFooter
            provider={swap.exchangeRate.provider}
            setError={setError}
            onContinue={onAcceptTOS}
            onClose={onClose}
            disabled={!checkedDisclaimer}
            ratesExpiration={ratesExpiration}
          />
        ) : result && swap ? (
          <StepFinishedFooter
            transaction={transaction}
            result={result}
            swap={swap}
            onClose={onClose}
          />
        ) : null
      }
    />
  );
};

export default SwapBody;
