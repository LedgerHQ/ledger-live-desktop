// @flow

import "@ledgerhq/react-ui/assets/fonts";
import React, { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import type { StyledComponent } from "styled-components";
import defaultTheme from "./theme";
import palettes from "./palettes";
import type { Theme } from "./theme";

import { GlobalStyle } from "./global";

import { defaultTheme as V3dDfaultTheme, palettes as V3Palettes } from "@ledgerhq/react-ui/styles";

type Props = {
  children: React.ReactNode;
  selectedPalette: "light" | "dark";
};

export type ThemedComponent<T> = StyledComponent<T, Theme, any>;

const StyleProvider = ({ children, selectedPalette }: Props) => {
  // V2 palettes are not typed in TS so we need to explicity type them as any
  const palettesAny: any = palettes;
  const theme: Theme = useMemo(
    () => ({
      ...defaultTheme,
      ...V3dDfaultTheme,
      colors: {
        ...defaultTheme.colors,
        palette: { ...palettesAny[selectedPalette], ...V3Palettes[selectedPalette] },
      },
    }),
    [palettesAny, selectedPalette],
  );

  console.log(V3dDfaultTheme, selectedPalette)

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default StyleProvider;
