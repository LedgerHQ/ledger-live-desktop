// @flow

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { lastSeenDeviceSelector, latestFirmwareSelector } from "~/renderer/reducers/settings";
import { Item, MockContainer } from "./shared";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";

const DebugFirmwareUpdater = () => {
  const [expanded, setExpanded] = useState(true);
  const lastSeenDevice = useSelector(lastSeenDeviceSelector);
  const latestFirmware = useSelector(latestFirmwareSelector);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);

  useEffect(() => {
    console.log({ lastSeenDevice, latestFirmware });
  }, [lastSeenDevice, latestFirmware]);

  return (
    <MockContainer>
      <Box>
        <Item color="palette.text.shade100" ff="Inter|Medium" fontSize={3} onClick={toggleExpanded}>
          {expanded ? "fw updater [ - ]" : "u"}
        </Item>
        {expanded ? (
          <>
            <Box>
              <Text mx={1} ff={"Inter|Medium"} color="palette.text.shade100" fontSize={3}>
                {latestFirmware ? `Fw version available: ${latestFirmware.final.version}` : ""}
              </Text>
            </Box>
            <Box vertical>
              <Text mx={1} ff={"Inter|Medium"} color="palette.text.shade100" fontSize={3}>
                <pre>
                  {JSON.stringify(
                    lastSeenDevice ? { ...lastSeenDevice.deviceInfo } : { error: "no device" },
                    undefined,
                    2,
                  )}
                </pre>
              </Text>
            </Box>
          </>
        ) : null}
      </Box>
    </MockContainer>
  );
};

export default DebugFirmwareUpdater;
