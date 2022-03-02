import React from "react";
import { Flex, Text } from "@ledgerhq/react-ui";
import styled from "@ledgerhq/react-ui/components/styled";
import { keyframes } from "styled-components";

const loading = keyframes`
{
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
`;

const Skeleton = styled(Flex).attrs({
  backgroundColor: "neutral.c40",
})`
  animation: ease-in-out alternate ${loading} 1s infinite;
`;

const PlaceholderBig = styled(Skeleton).attrs({ show: true })`
  border-radius: 4px;
`;
const PlaceholderMedium = styled(Skeleton).attrs({ show: true })`
  border-radius: 2px;
  height: 10px;
  width: ${p => p.width};
`;
const PlaceholderSmall = styled(Skeleton).attrs({ show: true })`
  border-radius: 1px;
  height: 6px;
  width: ${p => p.width};
`;

export const PlaceholderShow = styled(PlaceholderBig).attrs({
  height: 278,
  width: 193,
})``;

export const PlaceholderVideo = () => (
  <Flex flexDirection="column">
    <Flex position="relative">
      <PlaceholderBig height={126} width={225} mb="8px" />
      <Flex
        position="absolute"
        top="8px"
        right="8px"
        px="6px"
        py="4px"
        backgroundColor="neutral.c00"
        borderRadius="4px"
      >
        <Text variant="small" fontSize="12px" fontWeight="medium">
          12:30
        </Text>
      </Flex>
    </Flex>
    <PlaceholderMedium width="80%" mb="8px" />
    <PlaceholderSmall width="60%" />
  </Flex>
);

export const PlaceholderPodcast = () => (
  <Flex flexDirection="column">
    <PlaceholderBig height={120} width={120} mb="8px" />
    <PlaceholderMedium width="100%" mb="8px" />
    <PlaceholderSmall width="70%" />
  </Flex>
);

export const PlaceholderArticle = () => (
  <Flex flexDirection="row" alignItems="flex-start" mb="24px" width={278}>
    <PlaceholderBig height={53} width={53} mr="16px" />
    <Flex flex={1} flexDirection="column">
      <PlaceholderMedium width="100%" mb="8px" />
      <PlaceholderMedium width="55%" mb="8px" />
      <PlaceholderSmall width="20%" />
    </Flex>
  </Flex>
);
