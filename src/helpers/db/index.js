const db = process.env.STORYBOOK_ENV ? require('./db-storybook') : require('./db')

module.exports = db
