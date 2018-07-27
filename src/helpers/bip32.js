// @flow

type SplitConfig = {
  coinType: number,
}

export const isSegwitPath = (path: string): boolean => path.startsWith("49'")

export const isUnsplitPath = (path: string, splitConfig: SplitConfig) => {
  try {
    const coinType = parseInt(path.split('/')[1], 10)
    return coinType === splitConfig.coinType
  } catch (e) {
    return false
  }
}
