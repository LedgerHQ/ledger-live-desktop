import Color from "color";

import { enrichPalette } from "./";

function getCorrectTextColor(color) {
  /*
  From this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
  
  Color brightness is determined by the following formula: 
  ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
  
  I know this could be more compact, but I think this is easier to read/explain.
  
  */

  const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

  const hRed = color.getRed();
  const hGreen = color.getGreen();
  const hBlue = color.getBlue();

  const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
  if (cBrightness > threshold) {
    return "#000000";
  } else {
    return "#ffffff";
  }
}

export function createPalette(primaryColor, type = "light") {
  const C = new Color(primaryColor);
  const paper = C.mix(type === "light" ? new Color("#FFFFFF") : new Color("#1C1D1F"), 0.99);
  const defaultBg = C.mix(type === "light" ? new Color("#F9F9F9") : new Color("#131415"), 0.97);

  const P = {
    type,
    primary: {
      main: primaryColor,
      contrastText: C.isLight() ? "#000000" : "#FFFFFF",
    },
    secondary: {
      main:
        type === "light"
          ? C.isLight()
            ? C.darken(0.95)
            : C.lighten(0.95)
          : C.isLight()
          ? C.darken(0.95)
          : C.lighten(0.95),
    },
    divider: C.mix(
      type === "light" ? new Color("rgba(20,37,51, 0.1)") : new Color("rgba(255, 255, 255, 0.1)"),
      0.98,
    ).hex(),
    background: {
      paper: paper.hex(),
      default: defaultBg.hex(),
    },
    action: {
      active: C.mix(paper, 0.95),
      hover: C.mix(paper, 0.95),
      disabled: C.mix(
        type === "light" ? new Color("rgba(20, 37, 51, 0.1)") : new Color("rgba(255,255,255, 0.1)"),
        0.99,
      ).hex(),
    },
  };

  return {
    transparent: "transparent",
    pearl: "#ff0000",
    alertRed: "#ea2e49",
    warning: "#f57f17",
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
    starYellow: "#FFD24A",
    orange: "#ffa726",
    positiveGreen: "rgba(102, 190, 84, 1)",
    greenPill: "#41ccb4",
    smoke: "#666666",
    wallet: "#6490f1",
    blueTransparentBackground: "rgba(100, 144, 241, 0.15)",
    pillActiveBackground: "rgba(100, 144, 241, 0.1)",
    lightGreen: "rgba(102, 190, 84, 0.1)",
    lightRed: "rgba(234, 46, 73, 0.1)",
    lightWarning: "rgba(245, 127, 23, 0.1)",
    white: "#ffffff",
    experimentalBlue: "#165edb",
    marketUp_eastern: "#ea2e49",
    marketUp_western: "#66be54",
    marketDown_eastern: "#6490f1",
    marketDown_western: "#ea2e49",
    palette: enrichPalette(P),
  };
}
