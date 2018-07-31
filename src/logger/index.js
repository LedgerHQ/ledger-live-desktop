const logger =
  process.env.STORYBOOK_ENV || process.env.NODE_ENV === 'test'
    ? require('./logger-storybook')
    : require('./logger')

module.exports = logger
