// @flow

import React from "react";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import nanoX from "./assets/nanoX.svg";
import nanoS from "./assets/nanoS.svg";
import nanoBlue from "./assets/nanoBlue.svg";

import { DeviceSelectorOption } from "./DeviceSelectorOption";

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
