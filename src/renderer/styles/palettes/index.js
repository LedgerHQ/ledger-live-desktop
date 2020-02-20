// @flow

import Color from "color";

const context = require.context("./", true, /\.(json)$/);

const regexp = /\.\/(.+).json/;

const shades = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

type RawPalette = {
  type: "light" | "dark",
  primary: {
    main: string,
    contrastText: string,
  },
  secondary: {
    main: string,
  },
  divider: string,
  background: {
    paper: string,
    default: string,
  },
  action: {
    active: string,
    hover: string,
    disabled: string,
  },
};

export type Theme = {
  ...RawPalette,
  text: {
    shade10: string,
    shade20: string,
    shade30: string,
    shade40: string,
    shade50: string,
    shade60: string,
    shade70: string,
    shade80: string,
    shade90: string,
    shade100: string,
  },
};

const enrichPalette = (rawPalette: RawPalette): Theme => {
  return {
    ...rawPalette,
    text: shades.reduce((acc, value) => {
      acc[`shade${value}`] = Color(rawPalette.secondary.main)
        .alpha(value / 100)
        .toString();
      return acc;
    }, {}),
  };
};

const palettes = context.keys().reduce((acc, filename) => {
  const name = filename.match(regexp)[1];
  const rawPalette: RawPalette = context(filename);
  acc[name] = enrichPalette(rawPalette);

  return acc;
}, {});

export default palettes;
