// @flow

import db from 'helpers/db'
import uuid from 'uuid/v4'

// a user is an anonymous way to identify a same instance of the app

export default () => {
  let user = db.get('user')
  if (!user) {
    user = { id: uuid() }
    db.set('user', user)
  }
  return user
}
