// @flow
import React from "react";
import type { CreateStylesReturnType } from "~/renderer/components/Select/createStyles";
import { AccountOption } from "~/renderer/components/SelectAccount";
import type { Option } from "~/renderer/components/SelectAccount";

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

export const renderAccountValue = ({ data }: { data: Option }) =>
  data.account ? <AccountOption account={data.account} isValue singleLineLayout={false} /> : null;
