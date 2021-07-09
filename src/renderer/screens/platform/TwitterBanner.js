// @flow
import React, { useMemo } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box/Box";
import Alert from "~/renderer/components/Alert";
import Text from "~/renderer/components/Text";
import { useTranslation } from "react-i18next";
import { urls } from "~/config/urls";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  mb: 24,
}))``;

const twitterHashtag = "LedgerLiveApp";

export default function TwitterBanner() {
  const { t } = useTranslation();

  const url = useMemo(() => {
    const urlObj = new URL(urls.banners.twitterIntent);

    urlObj.searchParams.set("text", t("platform.catalog.twitterBanner.tweetText"));
    urlObj.searchParams.set("hashtags", twitterHashtag);

    return urlObj;
  }, [t]);

  return (
    <Container>
      <Alert
        type={"twitter"}
        mt={2}
        learnMoreLabel={`#${twitterHashtag}`}
        learnMoreUrl={url.toString()}
        bannerId={"platform-twitter-notices"}
      >
        <Text ff="Inter|Regular" fontSize={4}>
          {t("platform.catalog.twitterBanner.description")}
        </Text>
      </Alert>
    </Container>
  );
}
