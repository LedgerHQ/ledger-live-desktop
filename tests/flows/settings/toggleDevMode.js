import { settingsPage } from "../../common.js";

const toggleDevMode = async () => {
  await settingsPage.goToSettings();
  await settingsPage.goToExperimentalTab();
  await settingsPage.toggleDevModeButton();
};

export default toggleDevMode;