import React from "react";
import styled from "styled-components";
import Text from "@ui/components/Text";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 24px;
  align-items: center;
`;

const Bar = styled.div`
  transition: all 600ms linear;
  height: 4px;
  border-radius: 2px;
  flex: ${(p) => p.fill};
  background: ${(p) =>
    p.on ? p.theme.colors.palette.neutral.c100 : p.theme.colors.palette.neutral.c40};
`;

const Handler = styled.div`
  transition: all 600ms linear;
  padding: 4px;
  background: ${(p) => p.theme.colors.palette.neutral.c100};
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 6px;

  & span.index {
    display: flex;
    border-radius: 2px;
    height: 16px;
    width: 16px;
    justify-content: center;
    align-items: center;
    color: ${(p) => p.theme.colors.palette.neutral.c100};
    background: ${(p) => p.theme.colors.palette.neutral.c00};
  }
`;

interface Step {
  key: string;
  label: string;
}

export type OnboardingProps = {
  steps: Step[];
  currentIndex: number;
};

const Onboarding = ({ steps, currentIndex }: OnboardingProps): JSX.Element => {
  const currentStep = steps[currentIndex];
  const fill = ((currentIndex / (steps.length - 1)) * 100).toFixed(2);

  return (
    <Container>
      <Bar on fill={fill} />
      <Handler key={currentStep.key}>
        <Text className="index" color="palette.neutral.c00" ff="Inter|Regular" fontSize={1}>
          {currentIndex + 1}
        </Text>
        <Text color="palette.neutral.c00" ff="Inter|Regular" textTransform="uppercase" fontSize={1}>
          {currentStep.label}
        </Text>
      </Handler>
      <Bar fill={100 - fill} />
    </Container>
  );
};

export default Onboarding;
