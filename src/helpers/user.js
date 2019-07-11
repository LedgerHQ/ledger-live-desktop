// @flow

import db from 'helpers/db'
import uuid from 'uuid/v4'

// a user is an anonymous way to identify a same instance of the app

// only used by analytics. DEPRECATED (will will later switch to localStorage)
export default async () => {
  let user = await db.getKey('app', 'user')
  if (!user) {
    user = { id: uuid() }
    db.setKey('app', 'user', user)
  }
  return user
}

export const getUserId = () => {
  if (typeof window === 'object') {
    const { localStorage } = window
    let userId = localStorage.getItem('userId')
    if (!userId) {
      userId = uuid()
      localStorage.setItem('userId', userId)
      return userId
    }
    return localStorage.getItem('userId')
  }
  throw new Error('user is only to be called from renderer')
}
