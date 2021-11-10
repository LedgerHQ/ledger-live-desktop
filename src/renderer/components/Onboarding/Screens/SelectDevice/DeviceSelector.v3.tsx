// @flow

import React from "react";
import styled, { useTheme } from "styled-components";
import { DeviceModelId } from "@ledgerhq/devices";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import nanoX from "./assets/nanoX.v3.svg";
import nanoS from "./assets/nanoS.v3.svg";
import nanoS2 from "./assets/nanoS2.v3.svg";
import nanoXDark from "./assets/nanoXDark.v3.svg";
import nanoSDark from "./assets/nanoSDark.v3.svg";
import nanoS2Dark from "./assets/nanoS2Dark.v3.svg";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { DeviceSelectorOption } from "./DeviceSelectorOption";

registerAssets([nanoX, nanoS, nanoS2, nanoXDark, nanoSDark, nanoS2Dark]);

const makeAssetSelector = (lightAsset: any, darkAsset: any) => p =>
  p.theme.colors.palette.type === "light" ? lightAsset : darkAsset;

const DeviceSelectContainer: ThemedComponent<any> = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: stretch;
`;

const NanoS = styled.div`
  // TODO: rendering issue in the SVG in the "hole"
  background: url(${p => makeAssetSelector(nanoS, nanoSDark)(p)}) no-repeat center; 
  width: 49.2px;
  height: 250.1px;
`;

const NanoS2 = styled.div`
  // TODO: rendering issue in the SVG in the "hole"
  background: url(${p => makeAssetSelector(nanoS2, nanoS2Dark)(p)}) no-repeat center;
  width: 49.93px;
  height: 250.33px;
`;

const NanoX = styled.div`
  background: url(${p => makeAssetSelector(nanoX, nanoXDark)(p)}) no-repeat center;
  width: 53.83px;
  height: 250.87px;
`;

const devices = [
  {
    id: "nanoS",
    label: "LEDGER NANO S",
    Illu: NanoS,
    enabled: true,
  },
  {
    id: "nanoSP",
    label: "LEDGER NANO S 2",
    Illu: NanoS2,
    enabled: false,
  },
  {
    id: "nanoX",
    label: "LEDGER NANO X",
    Illu: NanoX,
    enabled: true,
  },
];

interface DeviceSelectorProps {
  onClick: (arg1: DeviceModelId) => void;
}

export function DeviceSelector({ onClick }: DeviceSelectorProps) {
  const theme = useTheme();
  return (
    <DeviceSelectContainer>
      {devices.map(({ id, label, Illu, enabled }, index, arr) => (
        <DeviceSelectorOption
          id={`device-${id}`}
          key={id}
          label={label}
          Illu={<Illu />}
          onClick={() => enabled && onClick(id)}
          isFirst={index === 0}
          isLast={index === arr.length - 1}
        />
      ))}
    </DeviceSelectContainer>
  );
}
