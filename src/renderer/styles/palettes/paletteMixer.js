import Color from "color";
import palettes, { enrichPalette } from "./";
import ensureContrast from "~/renderer/ensureContrast";
import { setColors } from "../theme";

function rotateContrast(color1, color2, color3) {
  return color1.contrast(color2) <= 3
    ? color3.isLight()
      ? color2
          .rotate(5)
          .darken(0.33)
          .string()
      : color2
          .rotate(5)
          .lighten(0.33)
          .string()
    : color2.string();
}

export function createPalette(primaryColor, type = "light") {
  const basePalette = palettes[type];

  const C = new Color(ensureContrast(primaryColor, basePalette.background.paper));

  const paper = C.mix(new Color(basePalette.background.paper), 0.99);
  const defaultBg = C.mix(new Color(basePalette.background.default), 0.97);

  const alertRed = new Color("#ea2e49");
  const warning = new Color("#f57f17");
  const orange = new Color("#ffa726");
  const positiveGreen = new Color("rgba(102, 190, 84, 1)");
  const greenPill = new Color("#41ccb4");
  const starYellow = new Color("#FFD24A");

  const marketUpEastern = new Color("#ea2e49");
  const marketUpWestern = new Color("#66be54");
  const marketDownEastern = new Color("#6490f1");
  const marketDownWestern = new Color("#ea2e49");

  const isLight = C.contrast(new Color("#FFFFFF")) < 4;

  const contrastText =
    C.contrast(new Color("#FFFFFF")) > 3 ? new Color("#FFFFFF") : new Color("#000000");

  const P = {
    type,
    primary: {
      main: isLight ? C.darken(0.1).string() : C.lighten(0.1).string(),
      contrastText: contrastText.string(),
    },
    secondary: {
      main: basePalette.secondary.main,
    },
    divider: basePalette.divider,
    background: {
      paper: paper.string(),
      default: defaultBg.string(),
    },
    action: {
      active: C.mix(paper, 0.95),
      hover: C.mix(paper, 0.95),
      disabled: basePalette.action.disabled,
    },
  };

  const contrastedColors = {
    alertRed: rotateContrast(C, alertRed, contrastText),
    warning: rotateContrast(C, warning, contrastText),
    orange: rotateContrast(C, orange, contrastText),
    positiveGreen: rotateContrast(C, positiveGreen, contrastText),
    greenPill: rotateContrast(C, greenPill, contrastText),
    starYellow: rotateContrast(C, starYellow, contrastText),
    marketUp_eastern: rotateContrast(C, marketUpEastern, contrastText),
    marketUp_western: rotateContrast(C, marketUpWestern, contrastText),
    marketDown_eastern: rotateContrast(C, marketDownEastern, contrastText),
    marketDown_western: rotateContrast(C, marketDownWestern, contrastText),
  };

  const newColors = {
    ...contrastedColors,
    transparent: "transparent",
    pearl: "#ff0000",
    black: "#000000",
    dark: "#142533",
    separator: "#aaaaaa",
    fog: "#d8d8d8",
    gold: "#d6ad42",
    graphite: "#767676",
    grey: "#999999",
    identity: "#41ccb4",
    lightFog: "#eeeeee",
    sliderGrey: "#F0EFF1",
    lightGraphite: "#fafafa",
    lightGrey: "#f9f9f9",
    smoke: "#666666",
    wallet: C.rotate(-5).string(),
    blueTransparentBackground: C.fade(0.85).string(),
    pillActiveBackground: C.fade(0.9).string(),
    lightGreen: new Color(contrastedColors.positiveGreen).fade(0.9).string(),
    lightRed: new Color(contrastedColors.alertRed).fade(0.9).string(),
    lightWarning: new Color(contrastedColors.warning).fade(0.9).string(),
    white: "#ffffff",
    experimentalBlue: C.rotate(5).string(),
  };

  setColors(newColors);

  return {
    ...newColors,
    palette: enrichPalette(P),
  };
}
