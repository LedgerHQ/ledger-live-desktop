// @flow
import React from "react";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import Text from "~/renderer/components/Text";
import { Subject } from "rxjs";
import { deserializeError } from "@ledgerhq/errors";
import { deviceInfo155, mockListAppsResult } from "@ledgerhq/live-common/lib/apps/mock";

const Item: ThemedComponent<{}> = styled(Text)`
  padding: 2px 13px;
  color: white;
  position: absolute;
  left: 8px;
  bottom: 8px;
  background: ${p => p.theme.colors.alertRed};
  border-radius: 4px;
  opacity: 0.9;
`;

const mockedEventStream = new Subject<any>();
export const mockedAppExec = () => mockedEventStream;

const parseRawEvents = (rawEvents, maybeKey): Object => {
  if (rawEvents && typeof rawEvents === "object") {
    if (maybeKey === "error") {
      return deserializeError(rawEvents);
    }
    if (Array.isArray(rawEvents)) return rawEvents.map(parseRawEvents);
    const event = {};
    for (const k in rawEvents) {
      if (rawEvents.hasOwnProperty(k)) {
        event[k] = parseRawEvents(rawEvents[k], k);
      }
    }
    return event;
  }
  return rawEvents;
};

if (getEnv("MOCK")) {
  window.mockDeviceEvent = (...o: any[]) => {
    for (const e of parseRawEvents(o)) {
      mockedEventStream.next(e);
    }
  };

  window.mockListAppsResult = mockListAppsResult;
  window.deviceInfo155 = deviceInfo155;
}

const DebugMock = () => (
  <Item color="palette.text.shade100" mb={3} ff="Inter|Medium" fontSize={4}>
    {"mock"}
  </Item>
);

export default getEnv("MOCK") ? DebugMock : () => null;
