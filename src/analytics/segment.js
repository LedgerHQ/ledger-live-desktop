// @flow

import uuid from 'uuid/v4'
import logger from 'logger'
import invariant from 'invariant'
import user from 'helpers/user'
import { DEBUG_ANALYTICS } from 'config/constants'
import { langAndRegionSelector } from 'reducers/settings'
import { getSystemLocale } from 'helpers/systemLocale'
import { load } from './inject-in-window'

invariant(typeof window !== 'undefined', 'analytics/segment must be called on renderer thread')

const sessionId = uuid()

const getContext = store => {
  const state = store.getState()
  const { language, region } = langAndRegionSelector(state)
  const systemLocale = getSystemLocale()
  return {
    ip: '0.0.0.0',
    appVersion: __APP_VERSION__,
    language,
    region,
    environment: __DEV__ ? 'development' : 'production',
    systemLanguage: systemLocale.language,
    systemRegion: systemLocale.region,
    sessionId,
  }
}

let storeInstance // is the redux store. it's also used as a flag to know if analytics is on or off.

export const start = (store: *) => {
  storeInstance = store
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  const { id } = user()
  load()
  analytics.identify(
    id,
    {},
    {
      context: getContext(store),
    },
  )
  if (DEBUG_ANALYTICS) {
    logger.log(`analytics: start() with user id ${id}`)
  }
}

export const stop = () => {
  storeInstance = null
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.reset()
  if (DEBUG_ANALYTICS) {
    logger.log(`analytics: stop()`)
  }
}

export const track = (event: string, properties: ?Object) => {
  if (!storeInstance) {
    return
  }
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.track(event, properties, {
    context: getContext(storeInstance),
  })
  if (DEBUG_ANALYTICS) {
    logger.log(`analytics: track(${event},`, properties)
  }
}

export const page = (category: string, name: ?string, properties: ?Object) => {
  if (!storeInstance) {
    return
  }
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.page(category, name, properties, {
    context: getContext(storeInstance),
  })
  if (DEBUG_ANALYTICS) {
    logger.log(`analytics: page(${category}, ${name || ''},`, properties)
  }
}
