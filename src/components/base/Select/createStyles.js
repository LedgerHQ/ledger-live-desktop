// @flow

import { ff } from 'styles/helpers'

export default (
  theme: any,
  {
    width,
    minWidth,
    small,
    isRight,
    isLeft,
  }: {
    width: number,
    minWidth: number,
    small: boolean,
    isRight: boolean,
    isLeft: boolean,
  },
) => ({
  control: (styles: Object, { isFocused }: Object) => ({
    ...styles,
    width,
    minWidth,
    ...ff('Inter|SemiBold'),
    height: small ? 34 : 40,
    minHeight: 'unset',
    borderRadius: isRight ? '0 4px 4px 0' : isLeft ? '4px 0 0 4px' : 4,
    borderColor: theme.colors.palette.divider,
    backgroundColor: theme.colors.palette.background.paper,

    ...(isFocused
      ? {
          borderColor: theme.colors.palette.primary.main,
          boxShadow: 'rgba(0, 0, 0, 0.05) 0 2px 2px',
        }
      : {}),
  }),
  valueContainer: (styles: Object) => ({
    ...styles,
    paddingLeft: 15,
    color: theme.colors.palette.text.shade100,
  }),
  input: (styles: Object) => ({
    ...styles,
    color: theme.colors.palette.text.shade80,
  }),
  indicatorSeparator: (styles: Object) => ({
    ...styles,
    background: 'none',
  }),
  noOptionsMessage: (styles: Object) => ({
    ...styles,
    fontSize: small ? 12 : 13,
  }),
  option: (styles: Object, { isFocused, isSelected }: Object) => ({
    ...styles,
    ...ff('Inter|Regular'),
    fontSize: small ? 12 : 13,
    color: theme.colors.palette.text.shade80,
    padding: '10px 15px 10px 15px',
    ':active': {
      ...styles[':active'],
      backgroundColor: theme.colors.palette.action.active,
    },
    ...(isFocused
      ? {
          background: theme.colors.palette.background.default,
          color: theme.colors.palette.text.shade100,
        }
      : {}),
    ...(isSelected
      ? {
          background: 'unset !important',
          ...ff('Inter|SemiBold'),
        }
      : {}),
  }),
  menu: (styles: Object) => ({
    ...styles,
    border: `1px solid ${theme.colors.palette.divider}`,
    boxShadow: 'rgba(0, 0, 0, 0.05) 0 2px 2px',
    background: theme.colors.palette.background.paper,
  }),
  menuList: (styles: Object) => ({
    ...styles,
    background: theme.colors.palette.background.paper,
    borderRadius: 3,
  }),
  menuPortal: (styles: Object) => ({ ...styles, zIndex: 101 }),
  container: (styles: Object) => ({
    ...styles,
    fontSize: small ? 12 : 13,
  }),
})
