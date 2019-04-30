// @flow
import { LEDGER_DEBUG_ALL_LANGS } from 'config/constants'

export const allLanguages = ['en', 'es', 'fr', 'ja', 'ko', 'ru', 'zh']
export const prodStableLanguages = ['en']
const languages = LEDGER_DEBUG_ALL_LANGS ? allLanguages : prodStableLanguages
export default languages
