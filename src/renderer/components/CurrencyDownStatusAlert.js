// @flow
import React from "react";
import { createCustomErrorClass } from "@ledgerhq/errors";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import ErrorBanner from "./ErrorBanner";
type Props = {
  currencies: Array<CryptoCurrency | TokenCurrency>,
};

const StratisDown2021Warning = createCustomErrorClass("StratisDown2021Warning");
const CosmosStargateFeb2021Warning = createCustomErrorClass("CosmosStargateFeb2021Warning");

const CurrencyDownStatusAlert = ({ currencies }: Props) => {
  const errors = [];
  if (currencies.some(c => c.id === "stratis")) errors.push(new StratisDown2021Warning());

  if (currencies.some(c => c.id === "cosmos")) errors.push(new CosmosStargateFeb2021Warning());

  return errors.length > 0 ? (
    <div>
      {errors.map((e, i) => (
        <ErrorBanner key={i} error={e} warning />
      ))}
    </div>
  ) : null;
};

export default CurrencyDownStatusAlert;
