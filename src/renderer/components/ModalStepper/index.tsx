import React, { useCallback, useState } from "react";
import styled from "styled-components";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";
import { Button, Text } from "@ledgerhq/react-ui";
import { ArrowRightRegular, CloseRegular } from "@ledgerhq/icons-ui/react";

const Container = styled.div`
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ModalContainer = styled(FlexBox)`
  background-color: ${p => p.theme.colors.palette.neutral.c00};
  height: 80%;
  flex: 0 0 80%;
  flex-direction: column;
  align-items: stretch;
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const StepContainer = styled(FlexBox).attrs(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
  flex: 1,
}))``;

const LeftPartContainer = styled(FlexBox).attrs(() => ({
  flexDirection: "column",
}))`
  height: 100%;
  flex: 0 0 52%;
  padding: 40px;
`;

const RightPartContainer = styled(FlexBox)`
  height: 100%;
  flex: 0 0 48%;
  background-color: ${p => p.bgColor || p.theme.colors.palette.primary.c60};
`;

const getLightNeutral80 = (p: any) => p.theme.colors.palette.neutral.c80;

const HeaderText = styled(Text).attrs(() => ({ ff: "Inter|Medium", fontSize: "12px" }))`
  color: ${p => getLightNeutral80(p)};
`;

const StepTitleText = styled(Text).attrs(() => ({
  type: "h3",
  ff: "Alpha|Medium",
  fontSize: "28px",
  uppercase: true,
}))`
  margin-bottom: 12px;
`;

const StepDescriptionText = styled(Text).attrs(() => ({ ff: "Inter", fontSize: "14px" }))`
  color: ${p => getLightNeutral80(p)};
`;

const ContinueButton = styled(Button)``;

const BackButton = styled(Button)``;

const HeaderTextSeparator = styled.div`
  width: 2.36px;
  height: 2.36px;
  left: 47.67px;
  top: 5.83px;
  margin: 0px 8px;
  background: ${p => getLightNeutral80(p)};
  transform: rotate(45deg);
`;

type StepProps = {
  title?: string;
  description?: string;
  AsideLeft?: React.ReactNode;
  AsideRight: React.ReactNode;
  bgColor?: string;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
  backDisabled?: boolean;
};

type StepLeftPartProps = {
  Header: React.ReactNode;
  title?: string;
  description?: string;
  AsideLeft?: React.ReactNode;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
  backDisabled?: boolean;
  onClickContinue: (...args: any) => any;
  onClickBack: (...args: any) => any;
};

type StepRightPartProps = {};

type Props = {
  title: string;
  steps: Array<StepProps>;
  close: (...args: any) => any;
  finish: (...args: any) => any;
};

const StepLeftPart: React.FC<StepLeftPartProps> = ({
  Header,
  title,
  description,
  AsideLeft,
  continueLabel = "Continue", // TODO: default
  backLabel = "Back", // TODO: default
  continueDisabled = false,
  backDisabled = false,
  onClickContinue,
  onClickBack,
}) => {
  return (
    <LeftPartContainer justifyContent="space-between">
      <FlexBox flexDirection="column">
        {Header}
        {AsideLeft || (
          <>
            <StepTitleText>{title}</StepTitleText>
            <StepDescriptionText>{description}</StepDescriptionText>
          </>
        )}
      </FlexBox>
      <FlexBox flexDirection="column">
        <ContinueButton type="primary" Icon={ArrowRightRegular} onClick={onClickContinue}>
          {continueLabel}
        </ContinueButton>
        <BackButton onClick={onClickBack}>{backLabel}</BackButton>
      </FlexBox>
    </LeftPartContainer>
  );
};

const StepRightPart: React.FC<StepProps | StepRightPartProps> = props => {
  const { AsideRight, bgColor } = props;
  return <RightPartContainer {...{ bgColor }}>{AsideRight || null}</RightPartContainer>;
};

function Header({ title, stepIndex, stepCount }) {
  return (
    <FlexBox flexDirection="row" alignItems="center" mb="32px">
      <HeaderText>{title}</HeaderText>
      <HeaderTextSeparator />
      <HeaderText>
        {stepIndex + 1}/{stepCount}
      </HeaderText>
    </FlexBox>
  );
}

function StepSlider({ stepIndex, stepCount }) {
  return null;
}

function CloseModalButton() {
  return (
    <CloseButtonContainer>
      <Button Icon={CloseRegular} />
    </CloseButtonContainer>
  );
}

const ModalStepper: React.FC<Props> = (props: Props) => {
  const { title, steps, close, finish } = props;
  const [stepIndex, setStepIndex] = useState(0);
  const stepCount = steps.length;
  const stepsProps = { stepIndex, stepCount };
  const step = steps[stepIndex];

  const onClickContinue = useCallback(() => {
    if (stepIndex === stepCount - 1) finish();
    setStepIndex(Math.min(stepIndex + 1, stepCount - 1));
  }, [stepIndex, stepCount, finish]);

  const onClickBack = useCallback(() => {
    if (stepIndex === 0) close();
    else setStepIndex(Math.max(0, stepIndex - 1));
  }, [stepIndex, close]);

  return (
    <Container>
      <ModalContainer>
        <StepContainer>
          <StepLeftPart
            Header={<Header title={title} {...stepsProps} />}
            title={step.title}
            description={step.description}
            AsideLeft={step.AsideLeft}
            continueLabel={step.continueLabel}
            backLabel={step.backLabel}
            continueDisabled={step.continueDisabled}
            backDisabled={step.backDisabled}
            {...{ onClickContinue, onClickBack }}
          />
          <StepRightPart AsideRight={step.AsideRight} bgColor={step.bgColor} />
          <StepSlider {...stepsProps} />
          <CloseModalButton {...{ close }} />
        </StepContainer>
      </ModalContainer>
    </Container>
  );
};

export default ModalStepper;
