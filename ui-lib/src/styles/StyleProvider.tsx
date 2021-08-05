import React, { useMemo } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { defaultTheme, palettes, GlobalStyle } from '.';

interface Props {
  children: React.ReactNode
  selectedPalette: 'light' | 'dark' | 'dusk'
}

const StyleProvider = ({ children, selectedPalette }: Props): React.ReactElement => {
  const theme: DefaultTheme = useMemo(
    () => ({
      ...defaultTheme,
      // @ts-expect-error
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
