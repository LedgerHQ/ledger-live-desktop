const { NODE_ENV } = process.env

global.__ENV__ = NODE_ENV || 'development'
global.__DEV__ = global.__ENV__ === 'development'
global.__PROD__ = global.__ENV__ === 'production'
