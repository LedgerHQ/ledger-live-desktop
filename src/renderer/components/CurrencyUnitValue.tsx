import React from 'react';
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import type { Unit } from "@ledgerhq/live-common/lib/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { localeSelector } from "~/renderer/reducers/settings";

type Props = {
  unit: Unit,
  value: BigNumber,
  before?: string,
  after?: string,
  showCode?: boolean,
  alwaysShowSign?: boolean,
};

const CurrencyUnitValue = ({ unit, value, before = "", after = "", ...rest }: Props) => {
  // TODO: V3 - Remove me as soon as we type selectors
  const locale = useSelector(localeSelector) as unknown as string;

  return <>{`${before}${formatCurrencyUnit(unit, value, { ...rest, locale })}${after}`}</>;
};

export default CurrencyUnitValue;
