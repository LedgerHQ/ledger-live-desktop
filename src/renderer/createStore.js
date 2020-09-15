// @flow

import { createStore, applyMiddleware, compose } from "redux";
// import { routerMiddleware } from 'react-router-redux'
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
  const enhancers = compose(
    applyMiddleware(...middlewares),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f, // eslint-disable-line
  );
  // $FlowFixMe
  return createStore(reducers, state, enhancers);
};
