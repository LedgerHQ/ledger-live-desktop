// @flow
import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box/Box";
import Alert from "~/renderer/components/Alert";
import Text from "~/renderer/components/Text";
import { useTranslation } from "react-i18next";

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  mb: 24,
}))``;

export default function TwitterBanner() {
  const { t } = useTranslation();

  const params = {
    text: t("platform.catalog.twitterBanner.tweetText"),
    hashtags: "LedgerLiveApp",
  };

  const paramsURI = Object.entries(params).reduce(
    (acc, [key, val]) => (acc += `&${key}=${encodeURI(val)}`),
    "",
  );

  const url = `https://twitter.com/intent/tweet?${paramsURI}`;

  return (
    <Container>
      <Alert
        type={"twitter"}
        mt={2}
        learnMoreLabel={`#${params.hashtags}`}
        learnMoreUrl={url}
        bannerId={"platform-twitter-notices"}
      >
        <Text ff="Inter|Regular" fontSize={4}>
          {t("platform.catalog.twitterBanner.description")}
        </Text>
      </Alert>
    </Container>
  );
}
