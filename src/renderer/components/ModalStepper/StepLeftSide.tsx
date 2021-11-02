import React from "react";
import styled from "styled-components";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";
import { Button, Text } from "@ledgerhq/react-ui";
import { ArrowRightRegular } from "@ledgerhq/icons-ui/react";

const Container = styled(FlexBox).attrs(() => ({
  flexDirection: "column",
}))`
  height: 100%;
  flex: 0 0 48%;
  padding: 40px;
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
  color: ${p => p.theme.colors.palette.neutral.c80};
`;

type StepLeftSideProps = {
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

const StepLeftSide = ({
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
}: StepLeftSideProps) => {
  return (
    <Container justifyContent="space-between">
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
        <Button
          disabled={continueDisabled}
          type="main"
          Icon={ArrowRightRegular}
          onClick={onClickContinue}
        >
          {continueLabel}
        </Button>
        <Button disabled={backDisabled} onClick={onClickBack}>
          {backLabel}
        </Button>
      </FlexBox>
    </Container>
  );
};

export default StepLeftSide;
