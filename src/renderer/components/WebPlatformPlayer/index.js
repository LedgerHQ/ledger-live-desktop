// @flow

import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";
import CrossCircle from "~/renderer/icons/CrossCircle";

import { PlatformsConfig } from "./config";
import useLedgerLiveApi from "./api";
import TopBar from "./TopBar";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const CustomIframe: ThemedComponent<{}> = styled.iframe`
  border: none;
  width: 100%;
  flex: 1;
  transition: opacity 200ms ease-out;
`;

const Wrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  flex: 1,
}))`
  position: relative;
`;

const Loader: ThemedComponent<{}> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

type Props = {
  platform: string,
};

const WebPlatformPlayer = ({ platform }: Props) => {
  const { targetRef } = useLedgerLiveApi(platform);
  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);

  const platformConfig = PlatformsConfig[platform];

  const handleLoad = useCallback(() => {
    setWidgetError(false);
    setWidgetLoaded(true);
  }, []);

  const handleReload = useCallback(() => {
    setLoadDate(Date.now());
    setWidgetError(false);
    setWidgetLoaded(false);
  }, []);

  useEffect(() => {
    if (!widgetLoaded) {
      const timeout = setTimeout(() => {
        setWidgetError(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [widgetLoaded, widgetError]);

  if (!platformConfig) return "Oops no platform";

  const { name, url } = platformConfig;

  return (
    <Container>
      <TopBar platform={platform} title={name} onReload={handleReload} />
      <Wrapper>
        <CustomIframe
          src={`${url}?${loadDate}`}
          ref={targetRef}
          style={{ opacity: widgetLoaded ? 1 : 0 }}
          onLoad={handleLoad}
        />
        {!widgetLoaded && !widgetError ? (
          <Loader>
            <BigSpinner size={50} />
          </Loader>
        ) : null}
        {!widgetLoaded && widgetError ? (
          <Loader>
            <CrossCircle size={50} color="red" />
          </Loader>
        ) : null}
      </Wrapper>
    </Container>
  );
};

export default WebPlatformPlayer;
