import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
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

const BodyWrapper = styled(FlexBox)`
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
  position: "relative",
}))`
  flex: 1;
`;

const LeftPartContainer = styled(FlexBox).attrs(() => ({
  flexDirection: "column",
}))`
  height: 100%;
  flex: 0 0 48%;
  padding: 40px;
`;

const RightPartContainer = styled(FlexBox)`
  height: 100%;
  flex: 0 0 52%;
  background-color: ${p => p.bgColor || p.theme.colors.palette.primary.c60};
  justify-content: center;
  align-items: center;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  width: ${p => p.percentage}%;
  background-color: ${p => p.theme.colors.palette.neutral.c100};
  transition: width ease-out 200ms;
`;

const StepSlider = ({ stepIndex, stepCount }) => {
  return <ProgressBar percentage={100 * ((stepIndex + 1) / stepCount)} />;
};

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

type StepRightPartProps = {
  AsideRight: React.ReactNode;
  bgColor?: string;
};

type Props = {
  title: string;
  steps: Array<StepProps>;
  onClose: (...args: any) => any;
  onFinish: (...args: any) => any;
};

const StepLeftPart = ({
  Header,
  title,
  description,
  AsideLeft,
  continueLabel = "Continue",
  backLabel = "Back",
  continueDisabled = false,
  backDisabled = false,
  onClickContinue,
  onClickBack,
}: StepLeftPartProps) => {
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
        <ContinueButton
          disabled={continueDisabled}
          type="main"
          Icon={ArrowRightRegular}
          onClick={onClickContinue}
        >
          {continueLabel}
        </ContinueButton>
        <BackButton disabled={backDisabled} onClick={onClickBack}>
          {backLabel}
        </BackButton>
      </FlexBox>
    </LeftPartContainer>
  );
};

const StepRightPart = (props: StepRightPartProps) => {
  const { AsideRight, bgColor } = props;
  return <RightPartContainer {...{ bgColor }}>{AsideRight || null}</RightPartContainer>;
};

const Header = ({ title, stepIndex, stepCount }) => (
  <FlexBox flexDirection="row" alignItems="center" mb="32px">
    <HeaderText>{title}</HeaderText>
    <HeaderTextSeparator />
    <HeaderText>
      {stepIndex + 1}/{stepCount}
    </HeaderText>
  </FlexBox>
);

const CloseModalButton = ({ onClick }) => (
  <CloseButtonContainer>
    <Button Icon={CloseRegular} {...{ onClick }} />
  </CloseButtonContainer>
);

const ModalStepper = (props: Props) => {
  const { title, steps, onClose, onFinish } = props;
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const stepCount = steps.length;
  const stepsProps = { stepIndex, stepCount };
  const step = steps[stepIndex];

  const defaultContinueLabel = t("common.continue");
  const defaultBackLabel = t("common.back");

  const onClickContinue = useCallback(() => {
    if (stepIndex === stepCount - 1) onFinish();
    setStepIndex(Math.min(stepIndex + 1, stepCount - 1));
  }, [stepIndex, stepCount, onFinish]);

  const onClickBack = useCallback(() => {
    if (stepIndex === 0) onClose();
    else setStepIndex(Math.max(0, stepIndex - 1));
  }, [stepIndex, onClose]);

  const onClickBackdrop = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Container onClick={onClickBackdrop}>
      <BodyWrapper onClick={e => e.stopPropagation()}>
        <StepContainer>
          <StepLeftPart
            Header={<Header title={title} {...stepsProps} />}
            title={step.title}
            description={step.description}
            AsideLeft={step.AsideLeft}
            continueLabel={step.continueLabel || defaultContinueLabel}
            backLabel={step.backLabel || defaultBackLabel}
            continueDisabled={step.continueDisabled}
            backDisabled={step.backDisabled}
            {...{ onClickContinue, onClickBack }}
          />
          <StepRightPart AsideRight={step.AsideRight} bgColor={step.bgColor} />
          <StepSlider {...stepsProps} />
          <CloseModalButton onClick={onClose} />
        </StepContainer>
      </BodyWrapper>
    </Container>
  );
};

export default ModalStepper;
