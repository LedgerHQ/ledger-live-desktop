// @flow

const allLanguages = ['en', 'fr']
const prodStableLanguages = ['en']
const languages = process.env.LEDGER_DEBUG_ALL_LANGS ? allLanguages : prodStableLanguages
export default languages
