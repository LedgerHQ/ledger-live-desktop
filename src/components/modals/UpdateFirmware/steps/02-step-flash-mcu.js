// @flow

import React, { PureComponent, Fragment } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { i } from 'helpers/staticPath'
import firmwareMain from 'commands/firmwareMain'

import { bootloader } from 'config/nontranslatables'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { StepProps } from '../'

import Installing from '../Installing'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
})``

const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 5,
  mb: 3,
})``

const Bullet = styled.span`
  font-weight: 600;
  color: #142533;
`

const Separator = styled(Box).attrs({
  color: 'fog',
})`
  height: 1px;
  width: 100%;
  background-color: currentColor;
`

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
    const { firmware, t } = this.props

    return installing || !firmware.shouldFlashMCU ? (
      <Installing installing={installing} progress={progress} />
    ) : (
      <Fragment>
        <Box mx={7}>
          <Text ff="Open Sans|Regular" align="center" color="smoke">
            <Bullet>{'1. '}</Bullet>
            {t('manager.modal.mcuFirst')}
          </Text>
          <img
            src={i('logos/unplugDevice.png')}
            style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
            alt={t('manager.modal.mcuFirst')}
          />
        </Box>
        <Separator my={6} />
        <Box mx={7}>
          <Text ff="Open Sans|Regular" align="center" color="smoke">
            <Bullet>{'2. '}</Bullet>
            <Trans i18nKey="manager.modal.mcuSecond">
              {'Press the left button and hold it while you reconnect the USB cable until the '}
              <Text ff="Open Sans|SemiBold" color="dark">
                {bootloader}
              </Text>
              {' screen appears'}
            </Trans>
          </Text>
          <img
            src={i('logos/bootloaderMode.png')}
            style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
            alt={t('manager.modal.mcuFirst')}
          />
        </Box>
      </Fragment>
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
