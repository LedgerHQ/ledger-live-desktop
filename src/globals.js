// @flow

const { NODE_ENV } = process.env

global.__ENV__ = NODE_ENV === 'development' ? NODE_ENV : 'production'
global.__DEV__ = global.__ENV__ === 'development'
global.__PROD__ = !global.__DEV__
