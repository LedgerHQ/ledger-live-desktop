// @flow

import db from 'helpers/db'
import uuid from 'uuid/v4'

// a user is an anonymous way to identify a same instance of the app

export default async () => {
  let user = await db.getKey('app', 'user')
  if (!user) {
    user = { id: uuid() }
    db.setKey('app', 'user', user)
  }
  return user
}
