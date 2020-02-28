// @flow

import Raven from "raven-js";

import user from "./../helpers/user";
import install from "./install";

export default async (shouldSendCallback: () => boolean) => {
  const u = await user();
  install(Raven, shouldSendCallback, u.id);
};

export const captureException = (e: Error) => {
  Raven.captureException(e);
};

export const captureBreadcrumb = (o: *) => {
  Raven.captureBreadcrumb(o);
};
