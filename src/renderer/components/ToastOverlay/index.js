// @flow

import React from "react";
import styled from "styled-components";
import { Toast } from "./Toast";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useToasts } from "@ledgerhq/live-common/lib/providers/ToastProvider";

const Wrapper: ThemedComponent<{}> = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 18px;
  & *:nth-child(n + 6) {
    display: none;
  }
`;

export function ToastOverlay() {
  const { toasts, dismissToast } = useToasts();
  return (
    <Wrapper>
      {toasts.map(({ id, type, title, text, icon, callback }) => (
        <Toast
          id={id}
          type={type}
          title={title}
          icon={icon}
          text={text}
          callback={callback}
          onDismiss={dismissToast}
          key={id}
        />
      ))}
    </Wrapper>
  );
}
