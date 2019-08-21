// @flow

import uuid from 'uuid/v4'
import logger from 'logger'
import invariant from 'invariant'
import { getSystemLocale } from 'helpers/systemLocale'
import { langAndRegionSelector, shareAnalyticsSelector } from 'reducers/settings'
import { getCurrentDevice } from 'reducers/devices'
import type { State } from 'reducers'

import { load } from './inject-in-window'

invariant(typeof window !== 'undefined', 'analytics/segment must be called on renderer thread')

let user = null
let osType = '?'
let osVersion = '?'
if (!process.env.STORYBOOK_ENV) {
  user = require('helpers/user').default
  const os = require('os')
  osType = os.type()
  osVersion = os.release()
}

const sessionId = uuid()

const getContext = _store => ({
  ip: '0.0.0.0',
})

const extraProperties = store => {
  const state: State = store.getState()
  const { language, region } = langAndRegionSelector(state)
  const systemLocale = getSystemLocale()
  const device = getCurrentDevice(state)
  const deviceInfo = device
  return {
    appVersion: __APP_VERSION__,
    language,
    region,
    environment: __DEV__ ? 'development' : 'production',
    systemLanguage: systemLocale.language,
    systemRegion: systemLocale.region,
    osType,
    osVersion,
    sessionId,
    ...deviceInfo,
  }
}

let storeInstance // is the redux store. it's also used as a flag to know if analytics is on or off.

export const start = async (store: *) => {
  if (!user) return
  const { id } = await user()
  logger.analyticsStart(id)
  storeInstance = store
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  load()
  analytics.identify(id, extraProperties(store), {
    context: getContext(store),
  })
}

export const stop = () => {
  logger.analyticsStop()
  storeInstance = null
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.reset()
}

export const track = (event: string, properties: ?Object, mandatory: ?boolean) => {
  logger.analyticsTrack(event, properties)
  if (!storeInstance || (!mandatory && !shareAnalyticsSelector(storeInstance.getState()))) {
    return
  }
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.track(
    event,
    {
      ...extraProperties(storeInstance),
      ...properties,
    },
    {
      context: getContext(storeInstance),
    },
  )
}

export const page = (category: string, name: ?string, properties: ?Object) => {
  logger.analyticsPage(category, name, properties)
  if (!storeInstance || !shareAnalyticsSelector(storeInstance.getState())) {
    return
  }
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }

  analytics.track(
    `Page ${category + (name ? ` ${name}` : '')}`,
    {
      ...extraProperties(storeInstance),
      ...properties,
    },
    {
      context: getContext(storeInstance),
    },
  )
}
