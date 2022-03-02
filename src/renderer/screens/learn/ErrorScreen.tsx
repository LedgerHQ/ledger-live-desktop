import React from "react";
import { Flex, Text } from "@ledgerhq/react-ui";
import { BracketRight, BracketLeft } from "@ledgerhq/react-ui/components/message/Log/Brackets";
import styled from "styled-components";
import Header from "./Header";

const Container = styled(Flex).attrs({
  width: "100%",
  flexDirection: "column",
  alignItems: "stretch",
})``;

type Props = {
  illustration?: React.ReactNode;
  title: string;
  description: string;
};

export default function ErrorScreen({ title, illustration, description }: Props) {
  return (
    <Container>
      <Header />
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
        rowGap="24px"
        flex={1}
      >
        {illustration && illustration}
        <Flex color="neutral.c100" flexDirection="row" justifyContent="center" alignItems="stretch">
          <BracketLeft />
          <Text variant="h5" mx="10px" my="6px">
            {title}
          </Text>
          <BracketRight />
        </Flex>
        <Text variant="paragraphLineHeight" fontSize="13px" fontWeight="medium">
          {description}
        </Text>
      </Flex>
    </Container>
  );
}
