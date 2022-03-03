import React, { useMemo } from "react";
import { Flex, Icons, Text } from "@ledgerhq/react-ui";
import styled from "@ledgerhq/react-ui/components/styled";
import { useTranslation } from "react-i18next";
import Header from "./Header";

import {
  PlaceholderShow,
  PlaceholderVideo,
  PlaceholderPodcast,
  PlaceholderArticle,
} from "./LoadingPlaceholders";
import { getPagePaddingLeft, getPagePaddingRight } from "~/renderer/components/Page";

const Container = styled(Flex).attrs({
  flexDirection: "column",
  alignItems: "stretch",
})`
  width: calc(100% + ${p => getPagePaddingLeft(p) + getPagePaddingRight(p)}px);
  margin-left: ${p => -getPagePaddingLeft(p)}px;
  margin-right: ${p => -getPagePaddingRight(p)}px;
`;

const PaddedContainer = styled(Flex)`
  padding-left: ${p => getPagePaddingLeft(p)}px;
  padding-right: ${p => getPagePaddingRight(p)}px;
`;

const SectionHeaderContainer = styled(PaddedContainer).attrs({
  flexDirection: "row",
  justifyContent: "space-between",
  mb: "24px",
})``;

const ScrollContainer = styled(Flex).attrs({
  flexDirection: "row",
  overflowX: "hidden",
})`
  padding-left: ${p => getPagePaddingLeft(p)}px;
`;

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
  return (
    <SectionHeaderContainer>
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
    </SectionHeaderContainer>
  );
}

function Section({ title, children, hasChevron, columnGap }: SectionProps) {
  return (
    <Flex flexDirection="column" mb="40px">
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
      <PaddedContainer>
        <Header />
      </PaddedContainer>
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
