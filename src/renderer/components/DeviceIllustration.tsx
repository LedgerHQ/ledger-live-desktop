// @flow

import React from "react";
import styled, { DefaultTheme, StyledComponent, ThemeProps } from "styled-components";
import nanoX from "~/renderer/images/nanoX.v3.svg";
import nanoS from "~/renderer/images/nanoS.v3.svg";
import nanoS2 from "~/renderer/images/nanoS2.v3.svg";
import nanoXDark from "~/renderer/images/nanoXDark.v3.svg";
import nanoSDark from "~/renderer/images/nanoSDark.v3.svg";
import nanoS2Dark from "~/renderer/images/nanoS2Dark.v3.svg";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { DeviceModelId } from "@ledgerhq/devices";

registerAssets([nanoX, nanoS, nanoS2, nanoXDark, nanoSDark, nanoS2Dark]);

const makeAssetSelector = (lightAsset: any, darkAsset: any) => (p: ThemeProps<DefaultTheme>) =>
  p.theme.colors.palette.type === "light" ? lightAsset : darkAsset;

const NanoS = styled.div`
  // TODO: rendering issue in the SVG in the "hole"
  background: url(${p => makeAssetSelector(nanoS, nanoSDark)(p)}) no-repeat center;
`;

const NanoSP = styled.div`
  // TODO: rendering issue in the SVG in the "hole"
  background: url(${p => makeAssetSelector(nanoS2, nanoS2Dark)(p)}) no-repeat center;
`;

const NanoX = styled.div`
  background: url(${p => makeAssetSelector(nanoX, nanoXDark)(p)}) no-repeat center;
`;

type Illustration = {
  Illustration: StyledComponent<"div", DefaultTheme, Record<string, unknown>, never>;
  width: number;
  height: number;
};

const illustrations: { [key in DeviceModelId]: Illustration } = {
  nanoS: {
    Illustration: NanoS,
    width: 49.2,
    height: 250.1,
  },
  nanoSP: {
    Illustration: NanoSP,
    width: 49.93,
    height: 250.33,
  },
  nanoX: {
    Illustration: NanoX,
    width: 53.83,
    height: 250.87,
  },
  blue: {
    Illustration: NanoS,
    width: 49.2,
    height: 250.1,
  },
};

type DeviceIllustrationProps = {
  deviceId: DeviceModelId;
  size?: number;
  height?: number;
  width?: number;
};

const DeviceIllustration = ({
  deviceId = DeviceModelId.nanoS,
  size,
  height,
  width,
  ...props
}: DeviceIllustrationProps) => {
  const illus = illustrations[deviceId];
  if (!illus) return null;
  const { Illustration, width: iW, height: iH } = illus;
  const sH = `${height || size || iH}px`;
  const sW = `${width || (size ? (size / iH) * iW : iW)}px`;
  return (
    <Illustration
      style={{
        height: sH,
        width: sW,
        backgroundSize: "contain",
      }}
      {...props}
    />
  );
};

export default DeviceIllustration;
