// @flow

import Color from "color";

import useTheme from "~/renderer/hooks/useTheme";

const ensureContrast = (color1: string, color2: string) => {
  const colorL1 = Color(color1).luminosity() + 0.05;
  const colorL2 = Color(color2).luminosity() + 0.05;

  const lRatio = colorL1 > colorL2 ? colorL1 / colorL2 : colorL2 / colorL1;

  if (lRatio < 1.5) {
    return Color(color1)
      .rotate(180)
      .negate()
      .string();
  }
  return color1;
};

export const useAutoContrast = (color: string) => {
  const color2 = useTheme("colors.palette.background.paper");

  return ensureContrast(color, color2);
};

export default ensureContrast;
