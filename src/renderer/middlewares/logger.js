// @flow

import logger from "~/logger";

export default () => (next: *) => (action: *) => {
  logger.onReduxAction(action);
  return next(action);
};
