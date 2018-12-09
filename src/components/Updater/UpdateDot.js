// @flow

import React from 'react'
import styled, { keyframes } from 'styled-components'

import { colors } from 'styles/theme'

import { withUpdaterContext } from './UpdaterContext'
import { VISIBLE_STATUS } from './Banner'
import type { UpdaterContextType, UpdateStatus } from './UpdaterContext'

type Props = {
  context: UpdaterContextType,
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const getColor = ({ status }: { status: UpdateStatus }) =>
  status === 'error' ? colors.alertRed : colors.wallet

const getOpacity = ({ status }: { status: UpdateStatus }) =>
  status === 'download-progress' || status === 'checking' ? 0.5 : 1

const Dot = styled.div`
  opacity: ${getOpacity};
  width: 8px;
  height: 8px;
  background-color: ${getColor};
  border-radius: 50%;
`

const Spinner = styled.div`
  opacity: 0.5;
  position: absolute;
  top: -3px;
  left: -3px;
  animation: ${rotate} 1.5s linear infinite;
  width: 14px;
  height: 14px;

  &:before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 4px;
    height: 4px;
    background-color: ${colors.wallet};
    border-radius: 50%;
  }

  &:after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: ${colors.wallet};
    border-radius: 50%;
  }
`

function UpdateDot(props: Props) {
  const { context } = props
  const { status } = context
  if (!VISIBLE_STATUS.includes(status)) return null
  const showSpinner = status === 'download-progress' || status === 'checking'
  return (
    <div style={styles.container}>
      {showSpinner && <Spinner />}
      <Dot status={status} />
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
  },
}

export default withUpdaterContext(UpdateDot)
