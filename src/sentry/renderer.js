// @flow

import * as Sentry from "@sentry/electron";
import user from "../helpers/user";
import install from "./install";

export default async (shouldSendCallback: () => boolean) => {
  const u = await user();
  install(Sentry, shouldSendCallback, u.id);
};

export const captureException = (e: Error) => {
  Sentry.captureException(e);
};

export const captureBreadcrumb = (o: *) => {
  Sentry.addBreadcrumb(o);
};
