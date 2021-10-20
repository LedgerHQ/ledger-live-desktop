// @flow

import React from "react";
import styled from "styled-components";
import { DeviceModelId } from "@ledgerhq/devices";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import nanoX from "./assets/nanoX.svg";
import nanoS from "./assets/nanoS.svg";
import nanoBlue from "./assets/nanoBlue.svg";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { DeviceSelectorOption } from "./DeviceSelectorOption";

registerAssets([nanoX, nanoS, nanoBlue]);

const DeviceSelectContainer: ThemedComponent<any> = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: stretch;
`;

const NanoX = styled.div`
  background: url(${nanoX}) no-repeat top right;
  width: 153px;
  height: 218px;
`;

const NanoS = styled.div`
  background: url(${nanoS}) no-repeat top right;
  width: 149px;
  height: 221px;
`;

const NanoBlue = styled.div`
  width: 191px;
  height: 221px;
  background: url(${nanoBlue}) no-repeat top right;
`;

const devices = [
  {
    id: "nanoS",
    label: "Nano S",
    Illu: NanoS,
  },
  {
    id: "nanoX",
    label: "Nano X",
    Illu: NanoX,
  },
  {
    id: "blue",
    label: "Blue",
    Illu: NanoBlue,
  },
];

interface DeviceSelectorProps {
  onClick: (arg1: DeviceModelId) => void;
}

export function DeviceSelector({ onClick }: DeviceSelectorProps) {
  return (
    <DeviceSelectContainer>
      {devices.map(({ id, label, Illu }, index) => (
        <DeviceSelectorOption
          id={`device-${id}`}
          key={id}
          label={label}
          Illu={<Illu />}
          onClick={() => onClick(id)}
          isFirst={index === 0}
          isLast={index === devices.length - 1}
        />
      ))}
    </DeviceSelectContainer>
  );
}
