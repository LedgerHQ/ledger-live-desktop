import React from "react";
import styled from "styled-components";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";
import { Button, Text } from "@ledgerhq/react-ui";
import { ArrowRightRegular } from "@ledgerhq/icons-ui/react";

const Container = styled(FlexBox).attrs(() => ({
  flexDirection: "column",
  p: 12,
}))`
  width: 48%;
`;

export type StepLeftSideProps = {
  Header: React.ReactNode;
  stepTitle?: string;
  description?: string;
  AsideLeft?: React.ReactNode;
  continueLabel?: string;
  backLabel?: string;
  hideContinueButton?: boolean;
  continueDisabled?: boolean;
  hideBackButton?: boolean;
  backDisabled?: boolean;
  onClickContinue?: (...args: any) => any;
  onClickBack?: (...args: any) => any;
};

const StepLeftSide = ({
  Header,
  stepTitle,
  description,
  AsideLeft,
  continueLabel = "Continue",
  backLabel = "Back",
  hideContinueButton = false,
  continueDisabled = false,
  backDisabled = false,
  hideBackButton = false,
  onClickContinue,
  onClickBack,
}: StepLeftSideProps) => {
  return (
    <Container justifyContent="space-between">
      <FlexBox flexDirection="column">
        {Header}
        {stepTitle && (
          <Text variant="h3" mb={5}>
            {stepTitle}
          </Text>
        )}
        {description && (
          <Text variant="body" fontWeight="medium" color="palette.neutral.c80">
            {description}
          </Text>
        )}
        {AsideLeft}
      </FlexBox>
      <FlexBox flexDirection="column">
        {!hideContinueButton && (
          <Button
            disabled={continueDisabled}
            variant="main"
            Icon={ArrowRightRegular}
            onClick={onClickContinue}
          >
            {continueLabel}
          </Button>
        )}
        {!hideBackButton && (
          <Button disabled={backDisabled} onClick={onClickBack}>
            {backLabel}
          </Button>
        )}
      </FlexBox>
    </Container>
  );
};

export default StepLeftSide;
