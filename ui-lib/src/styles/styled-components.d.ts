// import original module declarations
import "styled-components";
import { Theme } from "./theme";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme extends Theme {
    sizes: {
      topBarHeight: number;
      sideBarWidth: number;
      side: {
        big: {
          width: number;
        };
        small: {
          width: number;
        };
      };
      popin: {
        min: {
          height: number;
          width: number;
        };
        max: {
          height: number;
          width: number;
        };
      };
    };
    radii: number[];
    fontFamilies: Record<string, Record<string, any>>;
    fontSizes: number[];
    space: number[];
    shadows: string[];
    colors: {
      [key: string]: string | any;
    };
    animations: Record<string, (props: never) => any>;
    transition: (property?: string) => any;
    overflow: Record<string, any>;
    zIndexes: number[];
  }
}
