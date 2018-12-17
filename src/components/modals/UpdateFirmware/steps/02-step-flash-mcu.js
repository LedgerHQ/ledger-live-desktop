// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { filter, tap } from 'rxjs/operators'

import { i } from 'helpers/staticPath'
import firmwareMain from 'commands/firmwareMain'

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
  installing: boolean,
  progress: number,
}

class StepFlashMcu extends PureComponent<Props, State> {
  state = {
    installing: false,
    progress: 0,
  }

  componentDidMount() {
    const { final: finalFirmware, transitionTo, setError } = this.props

    this.sub = firmwareMain
      .send({ finalFirmware })
      .pipe(
        tap(e => console.log(e)), // eslint-disable-line no-console
        // ^ TODO remove at the end
        filter(e => e.type === 'bulk-progress' || e.type === 'install'),
      )
      .subscribe({
        next: e => {
          if (e.type === 'install') {
            this.setState({ installing: e.step, progress: 0 })
          } else {
            this.setState({ progress: e.progress })
          }
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
    const { t } = this.props

    return installing ? (
      <Installing progress={progress} />
    ) : (
      <Fragment>
        <Box mx={7}>
          <Text ff="Open Sans|Regular" align="center" color="smoke">
            <Bullet>{'1.'}</Bullet>
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
            <Bullet>{'2.'}</Bullet>
            {t('manager.modal.mcuSecond')}
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
