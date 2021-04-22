// @flow

import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";

import { PlatformsConfig } from "./config";
import useLedgerLiveApi from "./api";

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

type Props = {
  platform: string,
};

const WebPlatformPlayer = ({ platform }: Props) => {
  const { targetRef } = useLedgerLiveApi(platform);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);

  const rand = useRef(Date.now());

  const platformConfig = PlatformsConfig[platform];

  const handleLoad = useCallback(() => {
    setWidgetError(false);
    setWidgetLoaded(true);
  }, [setWidgetError, setWidgetLoaded]);

  useEffect(() => {
    if (!widgetLoaded) {
      const timeout = setTimeout(() => setWidgetError(true), 3000);

      return () => clearTimeout(timeout);
    }
  }, [widgetLoaded, setWidgetError]);

  if (!platformConfig) return "Oops no platform";

  const { name, url } = platformConfig;

  return (
    <Container>
      <Box>
        {name}
        {widgetError && " IFRAME GOT ERROR"}
      </Box>
      <CustomIframe
        src={`${url}?${rand.current}`}
        ref={targetRef}
        style={{ opacity: widgetLoaded ? 1 : 0 }}
        onLoad={handleLoad}
        onError={() => alert("ERROR")}
      />
    </Container>
  );
};

export default WebPlatformPlayer;
