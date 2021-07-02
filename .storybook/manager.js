import { addons } from "@storybook/addons";
import ledgerTheme from "./ledgerTheme";

addons.setConfig({
  // isFullscreen: false,
  // showNav: true,
  // showPanel: true,
  panelPosition: "right",
  enableShortcuts: true,
  isToolshown: true,
  theme: ledgerTheme,
  // selectedPanel: undefined,
  // initialActive: 'sidebar',
  // sidebar: {
  //   showRoots: false,
  //   collapsedRoots: ['other'],
  // },
  // toolbar: {
  //   title: { hidden: false, },
  //   zoom: { hidden: false, },
  //   eject: { hidden: false, },
  //   copy: { hidden: false, },
  //   fullscreen: { hidden: false, },
  // },
});
