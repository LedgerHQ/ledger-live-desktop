// @flow
import React, { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import theme, { colors } from "~/renderer/styles/theme";
import palette from "~/renderer/styles/palettes";
import "~/renderer/i18n/init";
import TriggerAppReady from "~/renderer/components/TriggerAppReady";
import RenderError from "~/renderer/components/RenderError";
import LiveStyleSheetManager from "~/renderer/styles/LiveStyleSheetManager";

// Like App except it just render an error

const themePalette = palette.light;
const lightLiveTheme = {
  ...theme,
  colors: {
    ...colors,
    palette: themePalette,
  },
};
const reloadApp = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "r") {
    window.api.reloadRenderer();
  }
};

const App = ({ language, error }: { error: Error, language: string }) => {
  useEffect(() => {
    window.addEventListener("keydown", reloadApp);
    return () => window.removeEventListener("keydown", reloadApp);
  }, []);

  return (
    <LiveStyleSheetManager>
      <ThemeProvider theme={lightLiveTheme}>
        <RenderError withoutAppData error={error}>
          <TriggerAppReady />
        </RenderError>
      </ThemeProvider>
    </LiveStyleSheetManager>
  );
};

export default App;
