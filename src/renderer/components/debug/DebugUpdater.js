// @flow
/* eslint-disable react/jsx-no-literals */

import React, { useState, useCallback, useContext, useEffect } from "react";
import { UpdaterContext } from "../Updater/UpdaterContext";
import type { UpdateStatus, MaybeUpdateContextType } from "../Updater/UpdaterContext";
import { Item, MockContainer, MockedGlobalStyle } from "./shared";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { getEnv } from "@ledgerhq/live-common/lib/env";

const statusToDebug: UpdateStatus[] = [
  "idle",
  "checking",
  "check-success",
  "update-available",
  "download-progress",
  "error",
];

const ExposeUpdaterWhenInMock = () => {
  const context = useContext<MaybeUpdateContextType>(UpdaterContext);
  const { setStatus, quitAndInstall } = context || {};

  useEffect(() => {
    if (getEnv("MOCK")) {
      window.mock.updater = {
        setStatus: setStatus,
        quitAndInstall: quitAndInstall,
      };
    }
  }, [setStatus]);

  return <MockedGlobalStyle />; // Still do the styles thingie
};

const DebugUpdater = () => {
  const [expanded, setExpanded] = useState(true);
  const context = useContext<MaybeUpdateContextType>(UpdaterContext);
  const { setStatus, quitAndInstall } = context || {};
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);

  useEffect(() => {
    if (getEnv("MOCK")) {
      window.mock.updater = {
        setStatus: setStatus,
      };
    }
  }, [setStatus]);

  return (
    <MockContainer>
      <Box>
        <Item color="palette.text.shade100" ff="Inter|Medium" fontSize={3} onClick={toggleExpanded}>
          {expanded ? "updater [ - ]" : "u"}
        </Item>
        {expanded ? (
          <Box vertical>
            {statusToDebug.map((s, i) => (
              <Box horizontal key={i}>
                <Text
                  mx={1}
                  id={`app-update-debug-${s}`}
                  ff={"Inter|Medium"}
                  color="palette.text.shade100"
                  fontSize={3}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </Text>
              </Box>
            ))}
            <Box vertical>
              <Box horizontal>
                <Text
                  mx={1}
                  ff="Inter|Medium"
                  color="palette.text.shade100"
                  fontSize={3}
                  onClick={quitAndInstall}
                >
                  {"quit and install"}
                </Text>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Box>
    </MockContainer>
  );
};

export default process.env.HIDE_DEBUG_MOCK ? ExposeUpdaterWhenInMock : DebugUpdater;
