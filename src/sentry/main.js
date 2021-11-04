// @flow
import * as Sentry from "@sentry/electron";
import install from "./install";

export default (shouldSendCallback: () => boolean, userId: string) => {
  install(Sentry, shouldSendCallback, userId);
};

export const captureException = (e: Error) => {
  Sentry.captureException(e);
};

export const captureBreadcrumb = (o: *) => {
  Sentry.addBreadcrumb(o);
};
