// @flow
import { LEDGER_DEBUG_ALL_LANGS } from 'config/constants'

const allLanguages = ['en', 'fr']
const prodStableLanguages = ['en']
const languages = LEDGER_DEBUG_ALL_LANGS ? allLanguages : prodStableLanguages
export default languages
