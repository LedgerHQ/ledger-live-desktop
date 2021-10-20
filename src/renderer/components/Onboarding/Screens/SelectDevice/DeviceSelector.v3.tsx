// @flow

import React from "react";
import styled from "styled-components";
import { DeviceModelId } from "@ledgerhq/devices";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import nanoX from "./assets/nanoX.v3.svg";
import nanoS from "./assets/nanoS.v3.svg";
import nanoS2 from "./assets/nanoS2.v3.svg";
// import nanoBlue from "./assets/nanoBlue.svg";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { DeviceSelectorOption } from "./DeviceSelectorOption";

registerAssets([nanoX, nanoS, nanoS2]);

const DeviceSelectContainer: ThemedComponent<any> = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: stretch;
`;

const NanoS = styled.div`
  background: url(${nanoS}) no-repeat center; // TODO: rendering issue in the SVG in the "hole"
  width: 49.2px;
  height: 250.1px;
`;

const NanoS2 = styled.div`
  background: url(${nanoS2}) no-repeat center; // TODO: rendering issue in the SVG in the "hole"
  width: 49.93px;
  height: 250.33px;
`;

const NanoX = styled.div`
  background: url(${nanoX}) no-repeat center;
  width: 53.83px;
  height: 250.87px;
`;

// const NanoBlue = styled.div`
//   width: 191px;
//   height: 221px;
//   background: url(${nanoBlue}) no-repeat top right;
// `;

const devices = [
  {
    id: "nanoS",
    label: "LEDGER NANO S",
    Illu: NanoS,
  },
  {
    id: "nanoS2",
    label: "LEDGER NANO S 2",
    Illu: NanoS2,
  },
  {
    id: "nanoX",
    label: "LEDGER NANO X",
    Illu: NanoX,
  },
  // {
  //   id: "blue",
  //   label: "Blue",
  //   Illu: NanoBlue,
  // },
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
