// @flow

import React from 'react'
import styled from 'styled-components'

import { colors } from 'styles/theme'

import { withUpdaterContext } from './UpdaterContext'
import { VISIBLE_STATUS } from './Banner'
import type { UpdaterContextType, UpdateStatus } from './UpdaterContext'

type Props = {
  context: UpdaterContextType,
}

const getColor = ({ status }: { status: UpdateStatus }) =>
  status === 'error' ? colors.alertRed : colors.wallet

const getOpacity = ({ status }: { status: UpdateStatus }) =>
  status === 'download-progress' || status === 'checking' ? 0.5 : 1

export const Dot = styled.div`
  opacity: ${getOpacity};
  width: 8px;
  height: 8px;
  background-color: ${getColor};
  border-radius: 50%;
`

function UpdateDot(props: Props) {
  const { context } = props
  const { status } = context
  if (!VISIBLE_STATUS.includes(status)) return null
  return <Dot status={status} />
}

export default withUpdaterContext(UpdateDot)
