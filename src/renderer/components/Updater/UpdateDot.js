// @flow

import React, { useContext } from "react";
import styled, { keyframes, css } from "styled-components";

import { colors } from "~/renderer/styles/theme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import type { UpdateStatus } from "./UpdaterContext";

import { UpdaterContext } from "./UpdaterContext";
import { VISIBLE_STATUS } from "./Banner";

const getColor = ({ status }: { status: UpdateStatus }) =>
  status === "error" ? colors.alertRed : colors.wallet;

const getOpacity = ({ status }: { status: UpdateStatus }) =>
  status === "download-progress" || status === "checking" ? 0.5 : 1;

const collapseAnim = keyframes`
  0% {
    opacity: 0;
    top: -5px;
    right: -5px;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    top: -5px;
    right: -5px;
    transform: translateY(0);
  }
`;

const openAnim = keyframes`
  0% {
    opacity: 0;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
  100% {
    opacity: 1;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
`;

export const Dot: ThemedComponent<{ status: UpdateStatus, collapsed?: ?boolean }> = styled.div`
  opacity: ${getOpacity};
  background-color: ${getColor};
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -5px;
  transform: translateY(0);
  opacity: 0;
  width: 12px;
  height: 12px;
  border: 1.5px solid ${p => p.theme.colors.palette.background.paper};
  animation: ${p =>
      p.collapsed
        ? css`
            ${collapseAnim}
          `
        : css`
            ${openAnim}
          `}
    200ms 500ms ease forwards;
`;

const UpdateDot = ({ collapsed }: { collapsed: ?boolean }) => {
  const context = useContext(UpdaterContext);
  if (context) {
    const { status } = context;
    if (!VISIBLE_STATUS.includes(status)) return null;
    return <Dot collapsed={collapsed} status={status} />;
  }

  return null;
};

export default UpdateDot;
