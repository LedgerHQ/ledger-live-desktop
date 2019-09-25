// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

import type { MemoryInfos } from 'types/common'

const Container = styled(Box).attrs(() => ({
  bg: 'palette.background.default',
  horizontal: true,
}))`
  border-radius: ${p => p.theme.radii[1]}px;
  overflow: hidden;
  height: 24px;
`

const Step = styled(Box).attrs(() => ({
  bg: p => p.theme.colors[p.c || 'palette.text.shade60'],
  px: 1,
  color: 'palette.background.paper',
}))`
  width: ${p => (p.last ? '' : `${p.percent}%`)};
  flex-grow: ${p => (p.last ? '1' : '')};
  text-align: ${p => (p.last ? 'right' : '')};
`

export default function MemInfos(props: { memoryInfos: MemoryInfos }) {
  const { memoryInfos: infos } = props
  const totalSize = infos.applicationsSize + infos.systemSize
  const appPercent = (infos.applicationsSize * 100) / totalSize
  return (
    <Container>
      <Step c="wallet" percent={appPercent}>{`${Math.round(
        infos.applicationsSize / 1000,
      )}kb`}</Step>
      <Step last>{`${Math.round(infos.freeSize / 1000)}kb`}</Step>
    </Container>
  )
}
