import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Flex } from "@ledgerhq/react-ui";
import useTheme from "~/renderer/hooks/useTheme";
import { useSelector } from "react-redux";
import { enableLearnPageStagingUrlSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";
import useIsOnline from "~/renderer/hooks/useIsOnline";
import LoadingScreen from "./LoadingScreen";
import NoConnectionScreen from "./NoConnectionScreen";
import ErrorScreen from "./ErrorScreen";
import { getPagePaddingLeft, getPagePaddingRight } from "~/renderer/components/Page";
import palettes from "~/renderer/styles/palettes";

const Container = styled(Flex).attrs({
  flex: 1,
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
})``;

const Iframe = styled.iframe`
  height: 100%;
  width: calc(100% + ${p => getPagePaddingLeft(p) + getPagePaddingRight(p)}px);
  margin-left: ${p => -getPagePaddingLeft(p)}px;
  margin-right: ${p => -getPagePaddingRight(p)}px;
`;

const learnProdURL = "https://www.ledger.com/ledger-live-learn";
const learnStagingURL = "https://ecommerce-website.aws.stg.ldg-tech.com/ledger-live-learn";
const TIMEOUT = 60 * 1000;

/** TODO: once design & wording are ready, implement properly */
const GenericErrorScreen = () => (
  <ErrorScreen title="Error" description="Something unexpected happened, please come back later." />
);

/** TODO: once design & wording are ready, implement properly */
const TimeoutScreen = () => (
  <ErrorScreen
    title="Server unreachable"
    description="It appears that our server is not responding, please come back later."
  />
);

export default function LearnScreen() {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const themeType: string = useTheme("colors.palette.type");
  const useStagingUrl = useSelector(enableLearnPageStagingUrlSelector);
  const params = new URLSearchParams({
    theme: themeType,
    lang: i18n.languages[0],
    pagePaddingLeft: `${getPagePaddingLeft({ theme })}px`,
    pagePaddingRight: `${getPagePaddingRight({ theme })}px`,
    darkBackgroundColor: `${palettes.dark.background.default}`,
    lightBackgroundColor: `${palettes.light.background.default}`,
  });
  const uri = `${useStagingUrl ? learnStagingURL : learnProdURL}?${params.toString()}`;

  const online = useIsOnline();
  const [initialLoadingDone, setInitialLoadingDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [errored, setErrored] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (online) {
      setInitialLoadingDone(false);
      setLoading(true);
      setIsTimeout(false);
      timer.current = setTimeout(() => {
        setIsTimeout(true);
        setLoading(false);
      }, TIMEOUT);
    } else {
      setLoading(false);
      setInitialLoadingDone(false);
    }
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [online]);

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
        {!online ? (
          <NoConnectionScreen />
        ) : (
          <>
            {errored ? (
              <GenericErrorScreen />
            ) : isTimeout ? (
              <TimeoutScreen />
            ) : loading ? (
              <LoadingScreen />
            ) : null}
            <Iframe
              loading="eager"
              onLoad={handleOnLoad}
              onError={handleError}
              sandbox="allow-scripts allow-same-origin"
              frameBorder="0"
              allowFullScreen={false}
              style={{
                opacity: isTimeout || errored || loading ? 0 : 1,
              }}
              src={uri}
            />
          </>
        )}
      </Flex>
    </Container>
  );
}
