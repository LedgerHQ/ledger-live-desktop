// @flow
import React from "react";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import ErrorBanner from "./ErrorBanner";
type Props = {
  currencies: Array<CryptoCurrency | TokenCurrency>,
};

const CurrencyDownStatusAlert = ({ currencies }: Props) => {
  const errors = [];

  return errors.length > 0 ? (
    <div>
      {errors.map((e, i) => (
        <ErrorBanner key={i} error={e} warning />
      ))}
    </div>
  ) : null;
};

export default CurrencyDownStatusAlert;
