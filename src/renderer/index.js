// @flow

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line import/no-extraneous-dependencies
import createHistory from 'history/createBrowserHistory'

import createStore from 'renderer/createStore'
import App from 'components/App'

import 'styles/global'

const history = createHistory()
const store = createStore(history)
const rootNode = document.getElementById('app')

function r(Comp) {
  if (rootNode) {
    render(<AppContainer>{Comp}</AppContainer>, rootNode)
  }
}

r(<App store={store} history={history} />)

if (module.hot) {
  module.hot.accept('../components/App', () => {
    const NewApp = require('../components/App').default // eslint-disable-line global-require
    r(<NewApp store={store} history={history} />)
  })
}
