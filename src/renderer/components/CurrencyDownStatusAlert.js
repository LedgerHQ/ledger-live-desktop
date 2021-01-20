// @flow
import React from "react";
import { createCustomErrorClass } from "@ledgerhq/errors";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import ErrorBanner from "./ErrorBanner";
type Props = {
  currencies: Array<CryptoCurrency | TokenCurrency>,
};

const StratisDown2021Warning = createCustomErrorClass("StratisDown2021Warning");

const CurrencyDownStatusAlert = ({ currencies }: Props) => {
  if (currencies.some(c => c.id === "stratis")) {
    return <ErrorBanner error={new StratisDown2021Warning()} warning />;
  }

  return null;
};

export default CurrencyDownStatusAlert;
