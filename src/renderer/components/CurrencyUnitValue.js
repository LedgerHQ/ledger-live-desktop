// @flow
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import type { Unit } from "@ledgerhq/live-common/lib/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { localeSelector } from "~/renderer/reducers/settings";

type RestProps = {
  showCode?: boolean,
  alwaysShowSign?: boolean,
};

type Props = {
  ...RestProps,
  unit: Unit,
  value: BigNumber,
  before?: string,
  after?: string,
};

const CurrencyUnitValue = ({ unit, value, before = "", after = "", ...rest }: Props) => {
  const locale = useSelector(localeSelector);
  return before + formatCurrencyUnit(unit, value, { ...rest, locale }) + after;
};

export default CurrencyUnitValue;
