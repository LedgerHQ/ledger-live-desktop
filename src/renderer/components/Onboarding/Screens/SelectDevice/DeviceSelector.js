// @flow

import React from "react";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import nanoX from "./assets/nanoX.svg";
import nanoS from "./assets/nanoS.svg";
import nanoSP from "./assets/NanoSP.svg";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { DeviceSelectorOption } from "./DeviceSelectorOption";

registerAssets([nanoX, nanoS, nanoSP]);

const DeviceSelectContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;

  & > * {
    margin: 0px 8px;
  }

  & > :first-child {
    margin-left: 0px;
  }

  & > :last-child {
    margin-right: 0px;
  }
`;

const NanoX = styled.div`
  background: url(${nanoX}) no-repeat top right;
  background-position: center;
  width: 36px;
  height: 180px;
`;

const NanoS = styled.div`
  background: url(${nanoS}) no-repeat top right;
  width: 36px;
  height: 180px;
`;

const NanoSP = styled.div`
  width: 36px;
  height: 180px;
  background: url(${nanoSP}) no-repeat top right;
`;

const devices = [
  {
    id: "nanoS",
    label: "Nano S",
    Illu: NanoS,
  },
  {
    id: "nanoSP",
    label: "nano S Plus",
    Illu: NanoSP,
  },
  {
    id: "nanoX",
    label: "Nano X",
    Illu: NanoX,
  },
];

type DeviceSelectorProps = {
  onClick: DeviceModelId => void,
};

export function DeviceSelector({ onClick }: DeviceSelectorProps) {
  return (
    <DeviceSelectContainer>
      {devices.map(({ id, label, Illu }) => (
        <DeviceSelectorOption
          id={`device-${id}`}
          key={id}
          label={label}
          Illu={<Illu />}
          onClick={() => onClick(id)}
        />
      ))}
    </DeviceSelectContainer>
  );
}
