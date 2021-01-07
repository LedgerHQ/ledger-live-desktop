// @flow

import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "~/renderer/middlewares/logger";
import analytics from "~/renderer/middlewares/analytics";
import reducers from "~/renderer/reducers";

type Props = {
  state?: Object,
  dbMiddleware?: Function,
};

export default ({ state, dbMiddleware }: Props) => {
  const middlewares = [thunk, logger];

  // middlewares.push(require('./../middlewares/sentry').default)
  middlewares.push(analytics);

  if (dbMiddleware) {
    middlewares.push(dbMiddleware);
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancers = composeEnhancers(applyMiddleware(...middlewares));

  // $FlowFixMe
  return createStore(reducers, state, enhancers);
};
