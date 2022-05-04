import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { noop } from "lodash";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";
import ProgressBar from "./ProgressBar";
import StepLeftSide, { StepLeftSideProps } from "./StepLeftSide";
import StepRightSide, { StepRightSideProps } from "./StepRightSide";
import ProgressHeader, { ProgressHeaderProps } from "./ProgressHeader";

export type Props = Omit<StepLeftSideProps, "Header"> & StepRightSideProps & ProgressHeaderProps;

const StepContainer = styled(FlexBox).attrs(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
  position: "relative",
}))`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export default function ModalStepperBody({
  title,
  stepTitle,
  description,
  AsideLeft,
  continueLabel,
  backLabel,
  hideContinueButton,
  continueDisabled,
  hideBackButton,
  backDisabled,
  onClickContinue = noop,
  onClickBack = noop,
  AsideRight,
  rightSideBgColor,
  stepIndex,
  stepCount,
  dataTestId,
}: Props) {
  const { t } = useTranslation();

  const stepsProps = { stepIndex, stepCount };

  const defaultContinueLabel = t("common.continue");
  const defaultBackLabel = t("common.back");
  return (
    <StepContainer data-test-id={dataTestId}>
      <StepLeftSide
        Header={<ProgressHeader title={title} {...stepsProps} />}
        stepTitle={stepTitle}
        description={description}
        AsideLeft={AsideLeft}
        continueLabel={continueLabel || defaultContinueLabel}
        backLabel={backLabel || defaultBackLabel}
        hideContinueButton={hideContinueButton}
        continueDisabled={continueDisabled}
        hideBackButton={hideBackButton}
        backDisabled={backDisabled}
        onClickContinue={onClickContinue}
        onClickBack={onClickBack}
        dataTestId={
          stepIndex !== stepCount - 1 ? "v3-modal-stepper-continue" : "v3-modal-stepper-end"
        }
      />
      <StepRightSide AsideRight={AsideRight} rightSideBgColor={rightSideBgColor} />
      <ProgressBar {...stepsProps} />
    </StepContainer>
  );
}
