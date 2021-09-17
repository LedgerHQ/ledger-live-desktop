import { createGlobalStyle } from "styled-components";

import { rgba } from "./helpers";
import { radii } from "./theme";
import reset from "./reset";

export const GlobalStyle = createGlobalStyle`
  ${reset};

  body {
    font-family: Inter;
    font-size: 100%;
  }
  
  @font-face {
    font-family: "Inter";
    src: url("./assets/fonts/inter/Inter-ExtraLight-BETA.woff2") format("woff2");
    font-weight: 100;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Inter";
    src: url("./assets/fonts/inter/Inter-Light-BETA.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Inter";
    src: url("./assets/fonts/inter/Inter-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Inter";
    src: url("./assets/fonts/inter/Inter-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Inter";
    src: url("./assets/fonts/inter/Inter-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Inter";
    src: url("./assets/fonts/inter/Inter-ExtraBold.woff2") format("woff2");
    font-weight: 900;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Alpha";
    src: url("./assets/fonts/alpha/HMAlphaMono-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
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

  .tippy-content {
    padding: 0 !important;
  }

  .tippy-tooltip.ledger-theme {
    background-color: ${(p) => p.theme.colors.palette.neutral.c100};
    color: ${(p) => p.theme.colors.palette.neutral.c00};
    border-radius: ${radii[1]}px;
  }

  .tippy-box {
    background-color: transparent;
  }

  .tippy-box[data-theme~='ledger'] > .tippy-svg-arrow {
    fill: ${(p) => p.theme.colors.palette.neutral.c100};
  }

  .tippy-box[data-theme~='ledger'].bg-alertRed > .tippy-svg-arrow {
    fill: ${(p) => p.theme.colors.palette.error.c100};
  }

  .tippy-box[data-theme~='ledger'].bg-palette-background-default > .tippy-svg-arrow {
    fill: ${(p) => p.theme.colors.palette.neutral.c00};
  }

  .tippy-box[data-theme~='ledger'].bg-palette-background-paper > .tippy-svg-arrow {
    fill: ${(p) => p.theme.colors.palette.neutral.c00};
  }

  .tippy-tooltip.ledger-theme .tippy-svg-arrow {
    fill: ${(p) => p.theme.colors.palette.neutral.c100};
  }

  .tippy-tooltip[data-placement^=bottom]>.tippy-svg-arrow {
    top: -6px;
  }

  .tippy-popper.ledger-theme .tippy-roundarrow {
    fill: ${(p) => p.theme.colors.palette.neutral.c100};
  }

  .select__control:hover, .select__control-is-focused {
    border-color: ${(p) => p.theme.colors.palette.neutral.c60};
  }

  .select__single-value {
    color: inherit !important;
    right: 0;
    left: 15px;
  }

  .select__placeholder {
    color ${(p) => p.theme.colors.palette.neutral.c40} !important;
  }

  ::selection {
    background: ${(p) => rgba(p.theme.colors.palette.primary.c180, 0.1)};
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
`;
