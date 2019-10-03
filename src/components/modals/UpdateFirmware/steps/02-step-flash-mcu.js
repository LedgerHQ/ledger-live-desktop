// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import firmwareMain from 'commands/firmwareMain'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import FlashMCU from 'components/FlashMCU'
import type { StepProps } from '../'
import Installing from '../Installing'

const Container = styled(Box).attrs(() => ({
  alignItems: 'center',
  fontSize: 4,
  color: 'palette.text.shade100',
}))``

const Title = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 5,
  mb: 3,
}))``

type Props = StepProps

type State = {
  installing: ?string,
  progress: number,
}

class StepFlashMcu extends PureComponent<Props, State> {
  state = {
    installing: null,
    progress: 0,
  }

  componentDidMount() {
    const { firmware, transitionTo, setError } = this.props

    this.sub = firmwareMain.send(firmware).subscribe({
      next: patch => {
        this.setState(patch)
      },
      complete: () => {
        transitionTo('finish')
      },
      error: error => {
        setError(error)
        transitionTo('finish')
      },
    })
  }

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe()
  }

  sub: *

  renderBody = () => {
    const { installing, progress } = this.state
    const { firmware, deviceModelId } = this.props

    return installing || !firmware.shouldFlashMCU ? (
      <Installing installing={installing} progress={progress} />
    ) : (
      <FlashMCU deviceModelId={deviceModelId} />
    )
  }

  render() {
    const { t } = this.props
    const { installing } = this.state
    return (
      <Container>
        <Title>{installing ? '' : t('manager.modal.mcuTitle')}</Title>
        <TrackPage category="Manager" name="FlashMCU" />
        {this.renderBody()}
      </Container>
    )
  }
}

export default StepFlashMcu
