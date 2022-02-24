// @flow

import React from "react";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import nanoX from "~/renderer/images/devices/nanoX.png";
import nanoXDark from "~/renderer/images/devices/nanoX_dark.png";
import nanoS from "~/renderer/images/devices/nanoS.png";
import nanoSDark from "~/renderer/images/devices/nanoS_dark.png";
import nanoSP from "~/renderer/images/devices/nanoSP.png";
import nanoSPDark from "~/renderer/images/devices/nanoSP_dark.png";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { DeviceSelectorOption } from "./DeviceSelectorOption";

registerAssets([nanoX, nanoS, nanoSP, nanoXDark, nanoSDark, nanoSPDark]);

const DeviceSelectContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  width: 480px;

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

const DeviceIllustration = styled.div`
  background: url(${p => p.url}) no-repeat top right;
  background-size: cover;
  background-position: center;
  width: 36px;
  height: 180px;
`;

const devices = [
  {
    id: "nanoS",
    label: "Nano S",
    images: {
      dark: nanoSDark,
      light: nanoS,
    },
  },
  {
    id: "nanoSP",
    label: "Nano S Plus",
    images: {
      dark: nanoSPDark,
      light: nanoSP,
    },
  },
  {
    id: "nanoX",
    label: "Nano X",
    images: {
      dark: nanoXDark,
      light: nanoX,
    },
  },
];

type DeviceSelectorProps = {
  onClick: DeviceModelId => void,
};

export function DeviceSelector({ onClick }: DeviceSelectorProps) {
  const type = useTheme("colors.palette.type") || "light";
  return (
    <DeviceSelectContainer>
      {devices.map(({ id, label, images }) => (
        <DeviceSelectorOption
          id={`device-${id}`}
          key={id}
          label={label}
          Illu={<DeviceIllustration url={images[type]} />}
          onClick={() => {
            // $FlowFixMe @ledgerhq/devices resolving to old version without nanoSP.
            onClick(id);
          }}
        />
      ))}
    </DeviceSelectContainer>
  );
}
