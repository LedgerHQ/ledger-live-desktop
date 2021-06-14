// @flow
import type { TFunction } from "react-i18next";
import type { Step } from "~/renderer/components/Stepper";

import type { Account } from "@ledgerhq/live-common/lib/types";

export type StepId = "paste" | "confirm";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  account: ?Account,
  error: *,
  link: string,
  setLink: Function,
  onClose: Function,
  onCloseWithoutDisconnect: Function,
};

export type St = Step<StepId, StepProps>;
