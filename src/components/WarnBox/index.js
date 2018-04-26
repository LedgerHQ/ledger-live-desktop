// @flow

import * as React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  color: 'graphite',
  borderRadius: 1,
  px: 4,
  py: 3,
  horizontal: true,
  ff: 'Open Sans',
  fontSize: 4,
  flow: 4,
})`
  border: solid 1px;
  border-color: ${p => p.theme.colors.fog};
  align-items: center;
`

const svg = (
  <svg width="36" height="43">
    <g fill="none">
      <path
        fill="#4B84FF"
        fillOpacity=".08"
        d="M18.177 2C18.06 24.126 18 37.184 18 41.174h.354C27.74 38.96 35 29.762 35 19.884V9.154L18.177 2z"
      />
      <path
        stroke="#142533"
        strokeWidth="2"
        d="M18 2L1 9.153v10.73c0 9.88 7.158 19.077 16.821 21.29h.358C27.663 38.96 35 29.764 35 19.884V9.154L18 2z"
      />
      <path
        fill="#4B84FF"
        d="M23.733 15.036c-.568 0-1.03.448-1.03 1.001l-.019 4.488s.002.313-.308.313c-.316 0-.307-.313-.307-.313v-6.474c0-.553-.456-.982-1.024-.982-.57 0-.974.43-.974.982v6.474s-.035.316-.34.316c-.303 0-.327-.316-.327-.316v-7.553c0-.552-.428-.972-.996-.972-.569 0-1 .42-1 .972v7.553s-.016.303-.344.303c-.321 0-.323-.303-.323-.303v-5.611c0-.553-.445-.9-1.013-.9-.57 0-.985.347-.985.9v8.2s-.056.365-.594-.237c-1.378-1.543-2.097-1.85-2.097-1.85s-1.31-.622-1.889.503c-.42.816.025.86.712 1.861.607.888 2.529 3.221 2.529 3.221s2.28 3.126 5.355 3.126c0 0 6.024.25 6.024-5.544l-.021-8.157c0-.553-.46-1.001-1.03-1.001"
      />
    </g>
  </svg>
)

type Props = {
  children: React.Node,
}

export default (props: Props) => (
  <Container>
    <Box mx={1}>{svg}</Box>
    <Box shrink>{props.children}</Box>
  </Container>
)
