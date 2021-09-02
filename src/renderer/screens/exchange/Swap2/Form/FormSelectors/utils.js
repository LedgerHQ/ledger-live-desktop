// @flow
import React from "react";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import type { CreateStylesReturnType } from "~/renderer/components/Select/createStyles";
import { AccountOption } from "~/renderer/components/SelectAccount";
import { CurrencyOption } from "~/renderer/components/SelectCurrency";
import type { Option as SelectAccountOption } from "~/renderer/components/SelectAccount";

export const selectRowStylesMap: CreateStylesReturnType => CreateStylesReturnType = styles => ({
  ...styles,
  control: (provided, state) => ({
    ...styles.control(provided, state),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }),
  menu: provided => ({
    ...styles.menu(provided),
    width: "200%",
  }),
  valueContainer: (styles: Object) => ({
    ...styles,
    height: "100%",
  }),
});

export const amountInputContainerProps = {
  noBorderLeftRadius: true,
};

export const renderAccountValue = ({ data }: { data: SelectAccountOption }) =>
  data.account ? <AccountOption account={data.account} isValue singleLineLayout={false} /> : null;

export const renderCurrencyValue = ({ data: currency }: { data: Currency }) => {
  return currency ? <CurrencyOption currency={currency} singleLineLayout={false} /> : null;
};
