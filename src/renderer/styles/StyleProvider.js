// @flow

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "~/renderer/styles/global";
import type { StyledComponent } from "styled-components";
import { themeSelector } from "~/renderer/actions/general";
import defaultTheme from "./theme";
import palettes from "./palettes";
import type { Theme } from "./theme";

type Props = {
  children: React$Node,
};

export type ThemedComponent<T> = StyledComponent<T, Theme, *>;

const StyleProvider = ({ children }: Props) => {
  const selectedPalette = useSelector(themeSelector) || "light";

  const theme: Theme = useMemo(
    () => ({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        palette: palettes[selectedPalette],
      },
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
