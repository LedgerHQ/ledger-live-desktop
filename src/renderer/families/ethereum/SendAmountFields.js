// @flow
import React from "react";
import GasLimitField from "./GasLimitField";
import GasPriceField from "./GasPriceField";

const Root = (props: *) => (
  <>
    <GasPriceField {...props} />
    <GasLimitField {...props} />
  </>
);

export default {
  component: Root,
  fields: ["gasPrice", "gasLimit"],
};
