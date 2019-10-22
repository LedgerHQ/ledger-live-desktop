// @flow

import * as React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const Container = styled(Box).attrs(() => ({
  color: 'palette.text.shade80',
  borderRadius: 1,
  px: 4,
  py: 3,
  horizontal: true,
  ff: 'Inter',
  fontSize: 4,
  flow: 4,
}))`
  border: solid 1px;
  border-color: ${p => p.theme.colors.palette.divider};
  align-items: center;
`

export const HandShield = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 50.8 56.914">
    <g transform="translate(-.6 -.48644)" fill="none">
      <path
        d="m26.25 2c-0.167 30.976-0.25 49.258-0.25 54.843h0.5c13.25-3.1 23.5-15.976 23.5-29.806v-15.022z"
        fill="#4b84ff"
        fillOpacity=".08"
      />
      <path
        d="m26 2-24 9.86v14.792c0 13.618 10.105 26.296 23.747 29.348h0.506c13.39-3.052 23.747-15.73 23.747-29.348v-14.791z"
        stroke="#142533"
        strokeWidth="2.8"
      />
      <path
        d="m33.58 20.108c-0.769 0-1.394 0.606-1.394 1.354l-0.025 6.072s3e-3 0.424-0.416 0.424c-0.428 0-0.417-0.424-0.417-0.424v-8.76c0-0.747-0.616-1.327-1.385-1.327-0.77 0-1.318 0.58-1.318 1.328v8.759s-0.047 0.428-0.46 0.428c-0.41 0-0.441-0.428-0.441-0.428v-10.219c0-0.747-0.58-1.315-1.349-1.315-0.77 0-1.353 0.568-1.353 1.315v10.219s-0.022 0.41-0.465 0.41c-0.435 0-0.437-0.41-0.437-0.41v-7.591c0-0.748-0.602-1.217-1.37-1.217-0.77 0-1.333 0.469-1.333 1.217v11.094s-0.076 0.493-0.803-0.321c-1.865-2.087-2.838-2.502-2.838-2.502s-1.77-0.843-2.555 0.68c-0.568 1.103 0.034 1.162 0.963 2.518 0.822 1.2 3.421 4.357 3.421 4.357s3.084 4.229 7.245 4.229c0 0 8.15 0.338 8.15-7.5l-0.028-11.036c0-0.748-0.623-1.354-1.392-1.354"
        fill="#4b84ff"
      />
    </g>
  </svg>
)

const svg = <HandShield size={43} />

type Props = {
  children: React.Node,
}

export default (props: Props) => (
  <Container>
    <Box mx={1}>{svg}</Box>
    <Box shrink>{props.children}</Box>
  </Container>
)
