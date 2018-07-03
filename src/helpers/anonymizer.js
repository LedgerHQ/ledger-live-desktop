// @flow

export default {
  url: (url: string): string =>
    url
      .replace(/\/addresses\/[^/]+/g, '/addresses/<HIDDEN>')
      .replace(/blockHash=[^&]+/g, 'blockHash=<HIDDEN>'),

  appURI: (uri: string): string => uri.replace(/account\/[^/]/g, 'account/<HIDDEN>'),

  filepath: (filepath: string): string => {
    const i = filepath.indexOf('/node_modules')
    if (i !== -1) return `.${filepath.slice(i)}`
    return filepath
  },
}
