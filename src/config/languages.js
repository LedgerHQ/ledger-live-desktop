// @flow
import { getEnv } from '@ledgerhq/live-common/lib/env'

export const allLanguages = ['en', 'es', 'fr', 'ja', 'ko', 'ru', 'zh']
export const prodStableLanguages = ['en', 'fr']
export const getLanguages = () =>
  getEnv('EXPERIMENTAL_LANGUAGES') ? allLanguages : prodStableLanguages
