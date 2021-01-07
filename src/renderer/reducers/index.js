// @flow
import { combineReducers } from "redux";
import accounts from "./accounts";
import application from "./application";
import devices from "./devices";
import modals from "./modals";
import settings from "./settings";
import onboarding from "./onboarding";
import type { AccountsState } from "./accounts";
import type { ApplicationState } from "./application";
import type { DevicesState } from "./devices";
import type { ModalsState } from "./modals";
import type { SettingsState } from "./settings";
import type { OnboardingState } from "./onboarding";

export type State = {
  accounts: AccountsState,
  application: ApplicationState,
  devices: DevicesState,
  modals: ModalsState,
  settings: SettingsState,
  onboarding: OnboardingState,
};

// $FlowFixMe
export default combineReducers({
  accounts,
  application,
  devices,
  modals,
  settings,
  onboarding,
});
