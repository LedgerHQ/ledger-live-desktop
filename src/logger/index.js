const logger = process.env.STORYBOOK_ENV ? require('./logger-storybook') : require('./logger')

module.exports = logger
