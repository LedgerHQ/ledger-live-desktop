// @flow

import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";

type Props = {
  currency: CryptoCurrency | TokenCurrency,
};

const CurrencyDownStatusAlert = ({ currency }: Props) => {
  // TODO remove the idea. LL-2256
  return null;
};

export default CurrencyDownStatusAlert;
