// @flow
import pathModule from "path";

const { NODE_ENV } = process.env;

const isRunningInAsar =
  process.mainModule && process.mainModule.filename.indexOf("app.asar") !== -1;

// prettier-ignore
const staticPath =
  __DEV__ && NODE_ENV !== 'test'
    ? __static
    : isRunningInAsar
      ? pathModule.join(pathModule.dirname(__dirname), 'static')
      : pathModule.join(__dirname, '/../../static')

export function unixify(path: string): string {
  return process.platform === "win32" ? path.replace(/\\/g, "/") : path;
}

export function getPath(path: string, posix?: boolean): string {
  const fullPath = isRunningInAsar
    ? pathModule.join(staticPath, path)
    : pathModule.normalize(`/${path}`);
  return posix ? unixify(fullPath) : fullPath;
}

/**
 * Returns resolved static path for given image path
 *
 * note: `i` for `image` (using `img` was confusing when using with <img /> tag)
 */
export const i = (path: string): string => getPath(`images/${path}`, true);

export default staticPath;
