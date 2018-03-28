// @flow

import React from 'react'

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 36 36" height={size} width={size} {...p}>
    <path
      fill="currentColor"
      d="M8.78055577 5C8.34946672 5 8 5.34946672 8 5.78055577V30.2194442C8 30.6505333 8.34946672 31 8.78055577 31H27.2194442C27.6505333 31 28 30.6505333 28 30.2194442V5.78055577C28 5.34946672 27.6505333 5 27.2194442 5H8.78055577zm0-2H27.2194442C28.7551028 3 30 4.24489722 30 5.78055577V30.2194442C30 31.7551028 28.7551028 33 27.2194442 33H8.78055577C7.24489722 33 6 31.7551028 6 30.2194442V5.78055577C6 4.24489722 7.24489722 3 8.78055577 3zm3.33166653 5h11.7755554C24.5020411 8 25 8.49795889 25 9.11222231V26.8877777C25 27.5020411 24.5020411 28 23.8877777 28H12.1122223C11.4979589 28 11 27.5020411 11 26.8877777V9.11222231C11 8.49795889 11.4979589 8 12.1122223 8zM12.5 9.5v17h11v-17h-11z"
    />
  </svg>
)
