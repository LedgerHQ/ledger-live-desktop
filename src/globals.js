// @flow

const { NODE_ENV, STORYBOOK_ENV } = process.env

const selectedTheme = 'light'

global.__ENV__ = NODE_ENV === 'development' ? NODE_ENV : 'production'
global.__DEV__ = global.__ENV__ === 'development'
global.__PROD__ = !global.__DEV__
global.__STORYBOOK_ENV__ = STORYBOOK_ENV === '1'
global.__GLOBAL_STYLES__ = require('./styles/reset')
global.__PALETTE__ = require('./styles/palette')[selectedTheme]

if (STORYBOOK_ENV === '1') {
  global.__APP_VERSION__ = '1.0.0'
}
