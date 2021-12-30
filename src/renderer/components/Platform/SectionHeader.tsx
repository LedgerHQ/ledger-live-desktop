import React from "react";
import styled from "styled-components";
import { Text, Flex } from "@ledgerhq/react-ui";

const Container = styled(Flex).attrs({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "stretch",
  mb: "24px",
})``;

const HeaderTitle = styled(Text).attrs({
  variant: "h5",
  fontSize: "20px",
  lineHeight: "24px",
})``;

type Props = {
  title: string;
  right?: React.ReactNode;
};

const SectionHeader: React.FC<Props> = ({ title, right }: Props) => {
  return (
    <Container>
      <HeaderTitle>{title}</HeaderTitle>
      {right && right}
    </Container>
  );
};

export default SectionHeader;
