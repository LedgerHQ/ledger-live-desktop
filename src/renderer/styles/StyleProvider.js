// @flow
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "~/renderer/styles/global";
import type { StyledComponent } from "styled-components";
import { themeSelector } from "~/renderer/actions/general";
import defaultTheme from "./theme";
import palettes from "./palettes";
import type { Theme } from "./theme";

import { createPalette } from "./palettes/paletteMixer";
import { userThemeCurrencySelector } from "../reducers/settings";

type Props = {
  children: React$Node,
};

export type ThemedComponent<T> = StyledComponent<T, Theme, *>;

const StyleProvider = ({ children }: Props) => {
  const selectedPalette = useSelector(themeSelector) || "light";
  const themeCurrency = useSelector(userThemeCurrencySelector);
  const isRave = themeCurrency?.isRave;

  const personalizedPalette = useMemo(
    () => (themeCurrency?.color ? createPalette(themeCurrency.color, selectedPalette) : {}),
    [selectedPalette, themeCurrency],
  );

  useEffect(() => {}, [isRave]);

  const theme: Theme = useMemo(
    () => ({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        palette: palettes[selectedPalette],
        ...personalizedPalette,
      },
    }),
    [selectedPalette, personalizedPalette],
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {isRave ? (
        <svg
          style={{
            zIndex: 1000,
            position: "fixed",
            top: 0,
            left: 0,
            mixBlendMode: "hue",
            pointerEvents: "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 380 100"
          height="100%"
        >
          <defs>
            <linearGradient id="myGradient" gradientTransform="rotate(15)">
              <stop offset="0%" stopColor="rgb(0, 165, 223)">
                <animate
                  attributeName="stop-color"
                  values="rgb(0, 165, 223); rgb(62, 20, 123); rgb(226, 0, 121); rgb(223, 19, 44); rgb(243, 239, 21); rgb(0, 152, 71); rgb(0, 165, 223)"
                  dur="12s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <stop offset="20%" stopColor="rgb(62, 20, 123)">
                <animate
                  attributeName="stop-color"
                  values="rgb(62, 20, 123); rgb(226, 0, 121); rgb(223, 19, 44); rgb(243, 239, 21); rgb(0, 152, 71); rgb(0, 165, 223);rgb(62, 20, 123)"
                  dur="12s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <stop offset="40%" stopColor="rgb(226, 0, 121)">
                <animate
                  attributeName="stop-color"
                  values="rgb(226, 0, 121); rgb(223, 19, 44); rgb(243, 239, 21); rgb(0, 152, 71); rgb(0, 165, 223); rgb(62, 20, 123);rgb(226, 0, 121)"
                  dur="12s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <stop offset="60%" stopColor="rgb(223, 19, 44)">
                <animate
                  attributeName="stop-color"
                  values="rgb(223, 19, 44); rgb(243, 239, 21); rgb(0, 152, 71); rgb(0, 165, 223); rgb(62, 20, 123); rgb(226, 0, 121);rgb(223, 19, 44)"
                  dur="12s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <stop offset="80%" stopColor="rgb(243, 239, 21)">
                <animate
                  attributeName="stop-color"
                  values="rgb(243, 239, 21); rgb(0, 152, 71); rgb(0, 165, 223); rgb(62, 20, 123); rgb(226, 0, 121); rgb(223, 19, 44);rgb(243, 239, 21)"
                  dur="12s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <stop offset="100%" stopColor="rgb(0, 152, 71)">
                <animate
                  attributeName="stop-color"
                  values="rgb(0, 152, 71); rgb(0, 165, 223); rgb(62, 20, 123); rgb(226, 0, 121); rgb(223, 19, 44); rgb(243, 239, 21);rgb(0, 152, 71)"
                  dur="12s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <animateTransform
                attributeName="gradientTransform"
                attributeType="XML"
                type="rotate"
                from="0 0.5 0.5"
                to="360 0.5 0.5"
                dur="12s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <rect width="380" height="100" fill="url(#myGradient)" />
        </svg>
      ) : personalizedPalette ? (
        <svg
          style={{
            zIndex: 100,
            position: "fixed",
            top: 0,
            left: 0,
            mixBlendMode: "hue",
            pointerEvents: "none",
            opacity: 0.4,
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 380 100"
          height="100%"
        >
          <defs>
            <linearGradient id="myGradient" gradientTransform="rotate(15)">
              <stop offset="0%" stopColor={personalizedPalette.palette.primary.main}>
                <animate
                  attributeName="stop-color"
                  values={`${personalizedPalette.palette.primary.main}; ${personalizedPalette.palette.background.paper}; ${personalizedPalette.palette.primary.main}`}
                  dur="16s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <stop offset="100%" stopColor={personalizedPalette.palette.background.paper}>
                <animate
                  attributeName="stop-color"
                  values={`${personalizedPalette.palette.background.paper}; ${personalizedPalette.palette.primary.main}; ${personalizedPalette.palette.background.paper}`}
                  dur="16s"
                  repeatCount="indefinite"
                ></animate>
              </stop>
              <animateTransform
                attributeName="gradientTransform"
                attributeType="XML"
                type="rotate"
                from="0 0.5 0.5"
                to="360 0.5 0.5"
                dur="16s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <rect width="380" height="100" fill="url(#myGradient)" />
        </svg>
      ) : null}
      {children}
    </ThemeProvider>
  );
};

export default StyleProvider;
