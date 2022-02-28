import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Flex } from "@ledgerhq/react-ui";
import useTheme from "~/renderer/hooks/useTheme";
import { useSelector } from "react-redux";
import { enableLearnPageStagingUrlSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";

const Container = styled(Flex).attrs({
  flex: 1,
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
})`
  margin-left: -${p => p.theme.space[6]}px;
  margin-right: -${p => p.theme.space[6] - p.theme.overflow.trackSize}px;
`;

const learnProdURL = "https://www.ledger.com/ledger-live-learn";
const learnStagingURL = "https://ecommerce-website.aws.stg.ldg-tech.com/ledger-live-learn";

export default function LearnScreen() {
  const { i18n } = useTranslation();
  const themeType: string = useTheme("colors.palette.type");
  const useStagingUrl = useSelector(enableLearnPageStagingUrlSelector);

  return (
    <Container>
      <Track onMount event="PageLearn" />
      <Flex flexGrow={1}>
        <iframe
          loading="eager"
          sandbox="allow-scripts allow-same-origin"
          frameBorder="0"
          allowFullScreen={false}
          width="100%"
          height="100%"
          src={`${useStagingUrl ? learnStagingURL : learnProdURL}?theme=${themeType}&lang=${
            i18n.languages[0]
          }`}
        />
      </Flex>
    </Container>
  );
}
