// @flow
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

type Derivation = {
  ({
    currency: CryptoCurrency,
    segwit: boolean,
    x: number,
  }): string,

  mandatoryEmptyAccountSkip?: number,
}

const ethLegacyMEW: Derivation = ({ x }) => `44'/60'/0'/${x}`
ethLegacyMEW.mandatoryEmptyAccountSkip = 10

const etcLegacyMEW: Derivation = ({ x }) => `44'/60'/160720'/${x}'/0`
etcLegacyMEW.mandatoryEmptyAccountSkip = 10

const rippleLegacy: Derivation = ({ x }) => `44'/144'/0'/${x}'`

const legacyDerivations = {
  ethereum: [ethLegacyMEW],
  ethereum_classic: [ethLegacyMEW, etcLegacyMEW],
  ripple: [rippleLegacy],
}

export const standardDerivation: Derivation = ({ currency, segwit, x }) => {
  const purpose = segwit ? 49 : 44
  const { coinType } = currency
  return `${purpose}'/${coinType}'/${x}'/0/0`
}

// return an array of ways to derivate, by convention the latest is the standard one.
export const getDerivations = (currency: CryptoCurrency): Derivation[] => [
  ...(legacyDerivations[currency.id] || []),
  standardDerivation,
]
