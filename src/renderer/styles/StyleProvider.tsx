import "@ledgerhq/react-ui/assets/fonts";
import React, { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import type { StyledComponent } from "styled-components";
import defaultTheme from "./theme";
import palettes from "./palettes";
import type { Theme } from "./theme";
import { merge } from "lodash"

import { GlobalStyle } from "@ledgerhq/react-ui/styles";

import { defaultTheme as DefaultThemeV3, palettes as PalettesV3 } from "@ledgerhq/react-ui/styles";

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
      ...DefaultThemeV3,
      colors: {
        ...defaultTheme.colors,
        ...PalettesV3[selectedPalette],
        palette: merge(palettesAny[selectedPalette], PalettesV3[selectedPalette]),
      },
      theme: selectedPalette,
    }),
    [palettesAny, selectedPalette],
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default StyleProvider;
