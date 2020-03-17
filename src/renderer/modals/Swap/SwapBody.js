// @flow
import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/swap/types";
import StepSummary, { StepSummaryFooter } from "~/renderer/modals/Swap/steps/StepSummary";
import StepDevice from "~/renderer/modals/Swap/steps/StepDevice";
import StepFinished, { StepFinishedFooter } from "~/renderer/modals/Swap/steps/StepFinished";
import Breadcrumb from "~/renderer/components/Stepper/Breadcrumb";
import Text from "~/renderer/components/Text";
import { useDispatch } from "react-redux";
import { updateAccount } from "~/renderer/actions/accounts";
import styled from "styled-components";

export const CountdownTimerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 12px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade50};
  border-radius: 24px;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

type SwapSteps = "summary" | "device" | "finished";
const SwapBody = ({
  swap,
  onClose,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  onClose: any,
}) => {
  const { exchange, exchangeRate } = swap;
  const [checkedDisclaimer, setCheckedDisclaimer] = useState(false);
  const [activeStep, setActiveStep] = useState<SwapSteps>("summary");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [swapId, setSwapId] = useState(null);
  const onAcceptTOS = useCallback(() => setActiveStep("device"), [setActiveStep]);
  const onSwitchAccept = useCallback(() => setCheckedDisclaimer(!checkedDisclaimer), [
    checkedDisclaimer,
  ]);

  const onDeviceInteraction = useCallback(
    async result => {
      const { operation, status } = result;
      debugger;
      let account = swap.exchange.fromAccount;
      account = {
        ...account,
        swapHistory: [
          ...(account.swapHistory || []),
          {
            status: "new",
            provider: exchangeRate.provider,
            operationId: operation.id,
            swapId: status.swapId,
            receiverAccountId: exchange.toAccount.id,
            fromAmount: exchange.fromAmount,
            toAmount: exchange.fromAmount.times(exchangeRate.magnitudeAwareRate),
          },
        ],
      };
      dispatch(updateAccount(account));
      setSwapId(status.swapId);
      setActiveStep("finished");
    },
    [dispatch, exchange, exchangeRate, swap, setActiveStep],
  );

  const items = [
    { label: <Trans i18nKey={"swap.modal.steps.summary.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.device.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.finished.title"} /> },
  ];

  return (
    <ModalBody
      onClose={onClose}
      title={<Trans i18nKey="swap.modal.title" />}
      render={() => (
        <>
          <Breadcrumb
            mb={40}
            currentStep={["summary", "device", "finished"].indexOf(activeStep)}
            items={items}
          />
          {activeStep === "summary" ? (
            <StepSummary
              swap={swap}
              checkedDisclaimer={checkedDisclaimer}
              onSwitchAccept={onSwitchAccept}
            />
          ) : activeStep === "device" ? (
            <StepDevice swap={swap} onContinue={onDeviceInteraction} onError={setError} />
          ) : swapId ? (
            <StepFinished swapId={swapId} />
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
        ) : (
          <StepFinishedFooter onClose={onClose} />
        )
      }
    />
  );
};

export default SwapBody;
