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
  children: React$Node,
  selectedPalette: "light" | "dark" | "dusk",
};

export type ThemedComponent<T> = StyledComponent<T, Theme, any>;

const StyleProvider = ({ children, selectedPalette }: Props) => {
  // V2 palettes are not typed in TS so we need to explicity type them as any
  const palettesAny: any = palettes;
  const v3SelectedPalettes = selectedPalette === "light" ? "light" : "dark";
  const theme: Theme = useMemo(
    () => ({
      ...V3dDfaultTheme,
      ...defaultTheme,
      colors: {
        ...V3Palettes[v3SelectedPalettes],
        ...defaultTheme.colors,
        palette: { ...V3Palettes[v3SelectedPalettes], ...palettesAny[selectedPalette] },
      },
    }),
    [palettesAny, selectedPalette, v3SelectedPalettes],
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default StyleProvider;
