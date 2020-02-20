// @flow

import Raven from "raven";
import install from "./install";

export default (shouldSendCallback: () => boolean, userId: string) => {
  install(Raven, shouldSendCallback, userId);
};

export const captureException = (e: Error) => {
  Raven.captureException(e);
};

export const captureBreadcrumb = (o: *) => {
  Raven.captureBreadcrumb(o);
};
