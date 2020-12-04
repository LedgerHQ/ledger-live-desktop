// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import nanoX from "./assets/nanoX.svg";
import nanoS from "./assets/nanoS.svg";
import nanoBlue from "./assets/nanoBlue.svg";

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
