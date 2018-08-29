// @flow

import { colors } from 'styles/theme'
import { ff } from 'styles/helpers'

export default ({
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
}) => ({
  control: (styles: Object, { isFocused }: Object) => ({
    ...styles,
    width,
    minWidth,
    ...ff('Open Sans|SemiBold'),
    height: small ? 34 : 40,
    minHeight: 'unset',
    borderRadius: isRight ? '0 4px 4px 0' : isLeft ? '4px 0 0 4px' : 4,
    borderColor: colors.fog,
    backgroundColor: 'white',

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
      : {}),
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
    fontSize: small ? 12 : 13,
  }),
})
