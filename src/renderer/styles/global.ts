// @flow

/* eslint-disable no-unused-expressions */
import { createGlobalStyle } from "styled-components";

import { rgba } from "./helpers";

import tippyStyles from "@ledgerhq/react-ui/components/message/Tooltip/styles";

export type GlobalStyleProps = {
  fontsPath?: string;
  fontMappings?: (name: string) => string;
};

export const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  body {
    font-family: Inter;
    font-size: 100%;
  }

  .spectron-run canvas:not(.visible-for-spectron) {
    visibility: hidden;
  }

  #react-root {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    max-height: 100%;
    width: 100vw;
    height: 100vh;
    background-color: ${(p) => p.theme.colors.palette.neutral.c00};
  }

  ::selection {
    background: ${(p) => rgba(p.theme.colors.palette.primary.c100, 0.1)};
  }

  --track-color: rgba(0,0,0,0);

  ::-webkit-scrollbar              {
    width: ${(p) => p.theme.overflow.trackSize}px;
    height: ${(p) => p.theme.overflow.trackSize}px;
    background-color: rgba(0,0,0,0);
  }
  ::-webkit-scrollbar-button       {
    opacity: 0;
    height: 0;
    width: 0;
  }
  ::-webkit-scrollbar-track        {
    background-color: rgba(0,0,0,0);
  }
  ::-webkit-scrollbar-thumb        {
    box-shadow: inset 0 0 0 ${(p) => p.theme.overflow.trackSize}px var(--track-color);
    border: 2px solid rgba(0,0,0,0);
    border-radius: ${(p) => p.theme.overflow.trackSize}px;
  }
  ::-webkit-scrollbar-corner {
    opacity: 0;
  }

  ${tippyStyles}
`;
