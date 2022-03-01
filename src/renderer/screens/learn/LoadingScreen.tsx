import React, { useMemo } from "react";
import { Flex, Icons, Text } from "@ledgerhq/react-ui";
import styled from "@ledgerhq/react-ui/components/styled";
import { useTranslation } from "react-i18next";
import { keyframes } from "styled-components";
import Header from "./Header";

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

const Container = styled(Flex).attrs({
  width: "100%",
  flexDirection: "column",
  alignItems: "stretch",
})``;

const ScrollContainer = styled(Flex).attrs({
  flexDirection: "row",
  overflowX: "scroll",
})``;

const PlaceholderShow = styled(PlaceholderBig).attrs({
  height: 278,
  width: 193,
})``;

const PlaceholderVideo = () => (
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

const PlaceholderPodcast = () => (
  <Flex flexDirection="column">
    <PlaceholderBig height={120} width={120} mb="8px" />
    <PlaceholderMedium width="100%" mb="8px" />
    <PlaceholderSmall width="70%" />
  </Flex>
);

const PlaceholderArticle = () => (
  <Flex flexDirection="row" alignItems="flex-start" mb="24px" width={278}>
    <PlaceholderBig height={53} width={53} mr="16px" />
    <Flex flex={1} flexDirection="column">
      <PlaceholderMedium width="100%" mb="8px" />
      <PlaceholderMedium width="55%" mb="8px" />
      <PlaceholderSmall width="20%" />
    </Flex>
  </Flex>
);

const ArrowButton = () => {
  return (
    <Flex flexDirection="row" alignItems="center" columnGap="4px">
      <Icons.ArrowLeftMedium color="neutral.c70" size="24px" />
      <Icons.ArrowRightMedium color="neutral.c100" size="24px" />
    </Flex>
  );
};

type SectionProps = {
  title?: string;
  children?: React.ReactNode;
  hasChevron?: boolean;
  columnGap?: string;
};

function SectionHeader({ title, hasChevron }: SectionProps) {
  const { t } = useTranslation();
  return (
    <Flex flexDirection="row" justifyContent="space-between" mb="24px">
      <Flex>
        <Text variant="h5" fontSize="20px">
          {title}
        </Text>
        {hasChevron && (
          <Flex
            ml="6px"
            justifyContent="center"
            alignItems="center"
            style={{ transform: "rotate(-90deg)" }}
          >
            <Icons.DropdownMedium size={20} color="neutral.c100" />
          </Flex>
        )}
      </Flex>
      <ArrowButton />
    </Flex>
  );
}

function Section({ title, children, hasChevron, columnGap }: SectionProps) {
  return (
    <Flex flexDirection="column" mb="40px" width="100%">
      {title && <SectionHeader hasChevron={hasChevron} title={title} />}
      <ScrollContainer columnGap={columnGap}>{children}</ScrollContainer>
    </Flex>
  );
}

export default function LearnSkeleton() {
  const { t } = useTranslation();
  const emptyArray = useMemo(() => new Array(10).fill(undefined), []);
  return (
    <Container>
      <Header />
      <Flex flexDirection="column" alignItems="stretch" width="100%" overflowY="scroll">
        <Section title={t("learn.sectionShows")} columnGap="12px">
          {emptyArray.map((i, key) => (
            <PlaceholderShow key={key} />
          ))}
        </Section>
        <Section title={t("learn.sectionVideo")} hasChevron columnGap="16px">
          {emptyArray.map((i, key) => (
            <PlaceholderVideo key={key} />
          ))}
        </Section>
        <Section title={t("learn.sectionPodcast")} hasChevron columnGap="16px">
          {emptyArray.map((i, key) => (
            <PlaceholderPodcast key={key} />
          ))}
        </Section>
        <Section title={t("learn.sectionArticles")} hasChevron columnGap="12px">
          {emptyArray.map((i, key) => (
            <Flex key={key} flexDirection="column">
              <PlaceholderArticle />
              <PlaceholderArticle />
            </Flex>
          ))}
        </Section>
      </Flex>
    </Container>
  );
}
