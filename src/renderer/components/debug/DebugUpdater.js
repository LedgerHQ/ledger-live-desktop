// @flow
/* eslint-disable react/jsx-no-literals */

import React, { useState, useCallback, useContext } from "react";
import { UpdaterContext } from "../Updater/UpdaterContext";
import type { UpdateStatus, MaybeUpdateContextType } from "../Updater/UpdaterContext";
import { Item, MockContainer } from "./shared";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";

const statusToDebug: UpdateStatus[] = [
  "idle",
  "checking",
  "check-success",
  "update-available",
  "download-progress",
  "error",
];

const DebugUpdater = () => {
  const [expanded, setExpanded] = useState(true);
  const context = useContext<MaybeUpdateContextType>(UpdaterContext);
  const { setStatus, quitAndInstall } = context || {};
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);

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

export default DebugUpdater;
