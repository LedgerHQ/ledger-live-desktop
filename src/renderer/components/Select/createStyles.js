// @flow

import { ff } from "~/renderer/styles/helpers";

export type CreateStylesReturnType = {
  container: (styles: Object) => Object,
  control: (styles: Object, { isFocused: boolean }) => Object,
  indicatorSeparator: (styles: Object) => Object,
  input: (styles: Object) => Object,
  menu: (styles: Object) => Object,
  menuList: (styles: Object) => Object,
  menuPortal: (styles: Object) => Object,
  noOptionsMessage: (styles: Object) => Object,
  option: (
    styles: Object,
    { isFocused: boolean, isSelected: boolean, isDisabled: boolean },
  ) => Object,
  singleValue: (styles: Object) => Object,
  valueContainer: (styles: Object) => Object,
};

export default (
  theme: any,
  {
    width,
    minWidth,
    small,
    isRight,
    isLeft,
    error,
    rowHeight,
  }: {
    width: number,
    minWidth: number,
    small: boolean,
    isRight: boolean,
    isLeft: boolean,
    error: ?Error,
    rowHeight: number,
  },
): CreateStylesReturnType => ({
  control: (styles: Object, { isFocused }: Object) => ({
    ...styles,
    width,
    minWidth,
    ...ff("Inter|SemiBold"),
    height: rowHeight || (small ? 34 : 48),
    minHeight: "unset",
    borderRadius: isRight ? "0 4px 4px 0" : isLeft ? "4px 0 0 4px" : 4,
    borderColor: error ? theme.colors.pearl : theme.colors.palette.divider,
    backgroundColor: theme.colors.palette.background.paper,

    ...(isFocused
      ? {
          borderColor: theme.colors.palette.primary.main,
          boxShadow: "rgba(0, 0, 0, 0.05) 0 2px 2px",
        }
      : {}),
  }),
  valueContainer: (styles: Object) => ({
    ...styles,
    paddingLeft: 15,
    color: theme.colors.palette.text.shade100,
    minHeight: rowHeight,
  }),
  singleValue: (styles: Object) => ({
    ...styles,
    overflow: "visible",
  }),
  input: (styles: Object) => ({
    ...styles,
    color: theme.colors.palette.text.shade80,
  }),
  indicatorSeparator: (styles: Object) => ({
    ...styles,
    background: "none",
  }),
  noOptionsMessage: (styles: Object) => ({
    ...styles,
    fontSize: small ? 12 : 13,
  }),
  option: (styles: Object, { isFocused, isSelected, isDisabled }: Object) => ({
    ...styles,
    ...(isSelected ? ff("Inter|SemiBold") : ff("Inter|Regular")),
    fontSize: small ? 12 : 13,
    color:
      isSelected || isFocused
        ? theme.colors.palette.text.shade100
        : theme.colors.palette.text.shade80,
    height: rowHeight,
    padding: small ? "8px 15px" : "10px 15px",
    cursor: isDisabled ? "not-allowed" : "default",
    backgroundColor: isFocused ? theme.colors.palette.background.default : null,
    // NB hover doesn't trigger isFocused since we disabled the onMouseMove/onMouseOver
    ":hover:not(:active)": {
      backgroundColor: !isDisabled ? theme.colors.palette.background.default : null,
      color: !isDisabled ? theme.colors.palette.text.shade100 : null,
    },
    ":hover:active": {
      color: !isDisabled ? theme.colors.palette.text.shade100 : null,
    },
    ":active": {
      ...styles[":active"],
      backgroundColor: isDisabled ? null : theme.colors.palette.text.shade10,
    },
  }),
  menu: (styles: Object) => ({
    ...styles,
    border: `1px solid ${theme.colors.palette.divider}`,
    boxShadow: "rgba(0, 0, 0, 0.05) 0 2px 2px",
    background: theme.colors.palette.background.paper,
    "--track-color": theme.colors.palette.text.shade30,
    borderRadius: 3,
  }),
  menuList: (styles: Object) => ({
    ...styles,
    background: theme.colors.palette.background.paper,
  }),
  menuPortal: (styles: Object) => ({ ...styles, zIndex: 101 }),
  container: (styles: Object) => ({
    ...styles,
    fontSize: small ? 12 : 13,
  }),
  placeholder: (styles: Object) => ({
    ...styles,
    whiteSpace: "nowrap",
    hyphens: "none",
  }),
});
