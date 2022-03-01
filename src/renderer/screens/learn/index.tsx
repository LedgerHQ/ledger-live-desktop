import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Flex, Text } from "@ledgerhq/react-ui";
import useTheme from "~/renderer/hooks/useTheme";
import { useSelector } from "react-redux";
import { enableLearnPageStagingUrlSelector } from "~/renderer/reducers/settings";
import LoadingScreen from "./LoadingScreen";
import Track from "~/renderer/analytics/Track";

const Container = styled(Flex).attrs({
  flex: 1,
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
})``;

const learnProdURL = "https://www.ledger.com/ledger-live-learn";
const learnStagingURL = "https://ecommerce-website.aws.stg.ldg-tech.com/ledger-live-learn";

const ErrorScreen = () => (
  <Flex height="100%" width="100%" alignItems={"center"} justifyContent="center">
    <Text variant="h1">ERROR</Text>
  </Flex>
);

const TimeoutScreen = () => (
  <Flex height="100%" width="100%" alignItems={"center"} justifyContent="center">
    <Text variant="h1">TIMEOUT</Text>
  </Flex>
);

export default function LearnScreen() {
  const { i18n } = useTranslation();
  const themeType: string = useTheme("colors.palette.type");
  const useStagingUrl = useSelector(enableLearnPageStagingUrlSelector);
  const uri = `${useStagingUrl ? learnStagingURL : learnProdURL}?theme=${themeType}&lang=${
    i18n.languages[0]
  }`;

  const [initialLoadingDone, setInitialLoadingDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [errored, setErrored] = useState(false);

  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setInitialLoadingDone(false);
    setLoading(true);
    setIsTimeout(false);
    timer.current = setTimeout(() => {
      console.log("learn handle timeout");
      setIsTimeout(true);
      setLoading(false);
    }, 60 * 1000);
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [uri, setInitialLoadingDone, setLoading, timer, setErrored, setIsTimeout]);

  const handleOnLoad = useCallback(() => {
    if (initialLoadingDone) return;
    setInitialLoadingDone(true);
    setLoading(false);
    timer.current && clearTimeout(timer.current);
  }, [initialLoadingDone, setInitialLoadingDone, setLoading, timer]);

  const handleError = useCallback(() => {
    if (!errored) {
      setErrored(false);
      setLoading(false);
    }
  }, [errored, setErrored, setLoading]);

  return (
    <Container>
      <Track onMount event="Page Learn" />
      <Flex flexGrow={1}>
        {errored ? (
          <ErrorScreen />
        ) : isTimeout ? (
          <TimeoutScreen />
        ) : loading ? (
          <LoadingScreen />
        ) : null}
        <iframe
          loading="eager"
          onLoad={handleOnLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin"
          frameBorder="0"
          allowFullScreen={false}
          width="100%"
          height={isTimeout || errored || loading ? 0 : "100%"}
          src={uri}
        />
      </Flex>
    </Container>
  );
}
