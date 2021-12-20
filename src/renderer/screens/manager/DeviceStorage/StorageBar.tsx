import React from "react";
import styled, { css, keyframes } from "styled-components";
import { Transition, TransitionGroup } from "react-transition-group";

import { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { AppsDistribution } from "@ledgerhq/live-common/lib/apps";
import { DeviceModel } from "@ledgerhq/devices";
import { Tooltip } from "@ledgerhq/react-ui";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";

import ByteSize from "~/renderer/components/ByteSize";
import { rgba } from "~/renderer/styles/helpers";
import OldText from "~/renderer/components/Text";

const blinkOpacity = keyframes`
0% {
  opacity: 0.6;
}
50% {
  opacity: 1;
}
100% {
  opacity: 0.6;
}
`;

const StorageBarWrapper: ThemedComponent<{ installing: boolean }> = styled.div`
  width: 100%;
  border-radius: 6px;
  height: 12px;
  background: ${p => p.theme.colors.palette.neutral.c30};
  overflow: hidden;
  position: relative;
`;

const StorageBarGraph = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: left;
  animation: ${p => p.theme.animations.fadeInGrowX};
`;

const transitionStyles = {
  entering: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
  entered: flexBasis => ({ opacity: 1, flexBasis }),
  exiting: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
  exited: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
};

/** each device storage bar will grow of 0.5% if the space is available or just fill its given percent basis if the bar is filled */
const StorageBarItem: ThemedComponent<{ ratio: number }> = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.installing ? props.theme.colors.palette.text.shade30 : props.color,
    ...transitionStyles[props.state](`${(props.ratio * 1e2).toFixed(3)}%`),
  },
}))`
  display: flex;
  flex: 0.005 0 0;
  background-color: black;
  position: relative;
  box-sizing: border-box;
  transform-origin: left;
  opacity: 1;
  border-radius: ${p => (p.isLast ? "0 6px 6px 0" : "0")};
  transition: all 0.33s ease-in-out;
  position: relative;
  overflow: hidden;
  ${p =>
    p.installing
      ? css`
          animation: ${blinkOpacity} 2s ease infinite;
        `
      : ""};
  & > * {
    width: 100%;
  }
`;

const TooltipContentWrapper: ThemedComponent<{}> = styled.div`
  & > :nth-child(1) {
    color: ${p => p.theme.colors.neutral.c00};
    text-align: center;
    display: block;
  }
  & > :nth-child(2) {
    color: ${p => p.theme.colors.neutral.c00};
    text-align: center;
  }
`;

const TooltipContent = ({
  name,
  bytes,
  deviceModel,
  deviceInfo,
}: {
  name: string;
  bytes: number;
  deviceModel: DeviceModel;
  deviceInfo: DeviceInfo;
}) => (
  <TooltipContentWrapper>
    <OldText>{name}</OldText>
    <OldText>
      <ByteSize value={bytes} deviceModel={deviceModel} firmwareVersion={deviceInfo.version} />
    </OldText>
  </TooltipContentWrapper>
);

// FIXME move to live-common
const appDataColors = {
  Exchange: "#39D2F3",
};

const getAppStorageBarColor = ({ name, currency }: { currency?: CryptoCurrency; name: string }) =>
  name in appDataColors ? appDataColors[name] : currency?.color;

const StorageBar = ({
  deviceInfo,
  distribution,
  deviceModel,
  isIncomplete,
  installQueue,
  uninstallQueue,
  jobInProgress,
}: {
  deviceInfo: DeviceInfo;
  distribution: AppsDistribution;
  deviceModel: DeviceModel;
  isIncomplete: boolean;
  installQueue: string[];
  uninstallQueue: string[];
  jobInProgress: boolean;
}) => (
  <StorageBarWrapper installing={jobInProgress}>
    {!isIncomplete && (
      <TransitionGroup component={StorageBarGraph}>
        {distribution.apps.map(({ name, currency, bytes, blocks }, index, arr) => (
          <Transition timeout={{ appear: 333, enter: 333, exit: 1200 }} key={`${name}`}>
            {state => (
              <Tooltip
                placement="top"
                hideOnClick={false}
                content={
                  <TooltipContent
                    name={name}
                    bytes={bytes}
                    deviceModel={deviceModel}
                    deviceInfo={deviceInfo}
                  />
                }
              >
                <StorageBarItem
                  state={state}
                  installing={installQueue.includes(name) || uninstallQueue.includes(name)}
                  color={getAppStorageBarColor({ name, currency })}
                  ratio={blocks / (distribution.totalBlocks - distribution.osBlocks)}
                  isLast={index === arr.length - 1}
                />
              </Tooltip>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    )}
  </StorageBarWrapper>
);

export default StorageBar;
