import React, { useMemo } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { defaultTheme, palettes, GlobalStyle } from ".";
import type { ThemeNames } from "./palettes";

interface Props {
  children: React.ReactNode;
  selectedPalette: ThemeNames;
}

const StyleProvider = ({ children, selectedPalette }: Props): React.ReactElement => {
  const theme: DefaultTheme = useMemo(
    () => ({
      ...defaultTheme,
      colors: { ...defaultTheme.colors, palette: palettes[selectedPalette] },
    }),
    [selectedPalette],
  );
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default StyleProvider;
