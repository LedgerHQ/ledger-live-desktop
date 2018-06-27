// @flow

const { NODE_ENV, STORYBOOK_ENV } = process.env

const isRunningInAsar =
  !STORYBOOK_ENV && process.mainModule && process.mainModule.filename.indexOf('app.asar') !== -1

const staticPath =
  __DEV__ && !STORYBOOK_ENV && NODE_ENV !== 'test'
    ? __static
    : isRunningInAsar
      ? __dirname.replace(/app\.asar$/, 'static')
      : !STORYBOOK_ENV
        ? `${__dirname}/../../static`
        : 'static'

export function getPath(path: string): string {
  return isRunningInAsar ? `${staticPath}/${path}` : `/${path}`
}

/**
 * Returns resolved static path for given image path
 *
 * note: `i` for `image` (using `img` was confusing when using with <img /> tag)
 */
export const i = (path: string): string => getPath(`images/${path}`)

export default staticPath
