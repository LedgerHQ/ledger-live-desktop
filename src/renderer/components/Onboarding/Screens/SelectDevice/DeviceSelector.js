// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { NanoS } from "./assets/NanoS";
import { NanoX } from "./assets/NanoX";
import { NanoBlue } from "./assets/NanoBlue";

import { DeviceSelectorOption } from "./DeviceSelectorOption";

const DeviceSelectContainer = styled.div`
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

const devices = [
  {
    id: "nano-s",
    label: "Nano S",
    Illu: NanoS,
  },
  {
    id: "nano-x",
    label: "Nano X",
    Illu: NanoX,
  },
  {
    id: "nano-blue",
    label: "Blue",
    Illu: NanoBlue,
  },
];

type DeviceSelectorProps = {
  onClick: string => void,
};

export function DeviceSelector({ onClick }: DeviceSelectorProps) {
  const { t } = useTranslation();

  return (
    <DeviceSelectContainer>
      {devices.map(({ id, label, Illu }) => (
        <DeviceSelectorOption key={id} label={label} Illu={Illu} onClick={() => onClick(id)} />
      ))}
    </DeviceSelectContainer>
  );
}
