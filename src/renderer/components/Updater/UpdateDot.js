// @flow

import React, { useContext } from "react";
import styled from "styled-components";

import { colors } from "~/renderer/styles/theme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import type { UpdateStatus } from "./UpdaterContext";

import { UpdaterContext } from "./UpdaterContext";
import { VISIBLE_STATUS } from "./Banner";

const getColor = ({ status }: { status: UpdateStatus }) =>
  status === "error" ? colors.alertRed : colors.wallet;

const getOpacity = ({ status }: { status: UpdateStatus }) =>
  status === "download-progress" || status === "checking" ? 0.5 : 1;

export const Dot: ThemedComponent<{ status: UpdateStatus }> = styled.div`
  opacity: ${getOpacity};
  width: 8px;
  height: 8px;
  background-color: ${getColor};
  border-radius: 50%;
`;

const UpdateDot = () => {
  const context = useContext(UpdaterContext);
  if (context) {
    const { status } = context;
    if (!VISIBLE_STATUS.includes(status)) return null;
    return <Dot status={status} />;
  }

  return null;
};

export default UpdateDot;
