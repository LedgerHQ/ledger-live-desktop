// @flow

import { colors } from 'styles/theme'
import { ff } from 'styles/helpers'

export default ({ width, minWidth }: { width: number, minWidth: number }) => ({
  control: (styles: Object, { isFocused }: Object) => ({
    ...styles,
    width,
    minWidth,
    ...ff('Open Sans|SemiBold'),
    height: 40,
    backgroundColor: 'white',
    cursor: 'pointer',
    ...(isFocused
      ? {
          borderColor: colors.wallet,
          boxShadow: 'rgba(0, 0, 0, 0.05) 0 2px 2px',
        }
      : {}),
  }),
  valueContainer: (styles: Object) => ({
    ...styles,
    paddingLeft: 15,
    color: colors.graphite,
  }),
  indicatorSeparator: (styles: Object) => ({
    ...styles,
    background: 'none',
  }),
  option: (styles: Object, { isFocused, isSelected }: Object) => ({
    ...styles,
    ...ff('Open Sans|Regular'),
    color: colors.dark,
    padding: '10px 15px 10px 15px',
    ...(isFocused
      ? {
          background: colors.lightGrey,
          color: colors.dark,
        }
      : {}),
    ...(isSelected
      ? {
          background: 'unset !important',
          ...ff('Open Sans|SemiBold'),
        }
      : {
          cursor: 'pointer',
        }),
  }),
  menu: (styles: Object) => ({
    ...styles,
    border: `1px solid ${colors.fog}`,
    boxShadow: 'rgba(0, 0, 0, 0.05) 0 2px 2px',
  }),
  menuList: (styles: Object) => ({
    ...styles,
    background: 'white',
    borderRadius: 3,
  }),
  container: (styles: Object) => ({
    ...styles,
    fontSize: 13,
  }),
})
