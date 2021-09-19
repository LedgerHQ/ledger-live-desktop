import dark from "./dark.json";
import light from "./light.json";

export type ThemeNames = "dark" | "light";
export interface Palette {
  type: ThemeNames;
  primary: {
    c05: string;
    c20: string;
    c40: string;
    c60: string;
    c80: string;
    c100: string;
    c120: string;
    c140: string;
    c160: string;
    c180: string;
  };
  neutral: {
    c00: string;
    c20: string;
    c30: string;
    c40: string;
    c50: string;
    c60: string;
    c70: string;
    c80: string;
    c90: string;
    c100: string;
    c100a07: string;
  };
  success: {
    c05: string;
    c10: string;
    c20: string;
    c40: string;
    c60: string;
    c80: string;
    c100: string;
  };
  warning: {
    c05: string;
    c10: string;
    c20: string;
    c40: string;
    c60: string;
    c80: string;
    c100: string;
  };
  error: {
    c05: string;
    c10: string;
    c20: string;
    c40: string;
    c60: string;
    c80: string;
    c100: string;
  };
}
// FIXME I can't seem to type this
const palettes: any = {
  dark,
  light,
};

export default palettes;
