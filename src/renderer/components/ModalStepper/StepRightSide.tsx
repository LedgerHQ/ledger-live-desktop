import React from "react";
import styled from "styled-components";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";

const Container = styled(FlexBox)`
  height: 100%;
  flex: 0 0 52%;
  justify-content: center;
  align-items: center;
`;

type StepRightSideProps = {
  AsideRight: React.ReactNode;
  bgColor?: string;
};

const StepRightSide = (props: StepRightSideProps) => {
  const { AsideRight, bgColor } = props;
  return (
    <Container backgroundColor={bgColor || "palette.primary.c60"}>{AsideRight || null}</Container>
  );
};

export default StepRightSide;
