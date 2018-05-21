// @flow
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

function shouldDerivateChangeFieldInsteadOfAccount(c: CryptoCurrency) {
  // ethereum have a special way of derivating things
  return c.id.indexOf('ethereum') === 0
}

// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// x is a derivation index. we don't always derivate the same part of the path
export function makeBip44Path({
  currency,
  segwit,
  x,
}: {
  currency: CryptoCurrency,
  segwit?: boolean,
  x?: number,
}): string {
  const purpose = segwit ? 49 : 44
  const coinType = currency.coinType
  let path = `${purpose}'/${coinType}'`
  if (shouldDerivateChangeFieldInsteadOfAccount(currency)) {
    path += "/0'"
    if (x !== undefined) {
      path += `/${x}`
    }
  } else if (x !== undefined) {
    path += `/${x}'`
  }
  return path
}
