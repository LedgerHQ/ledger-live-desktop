// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { Currency } from '@ledgerhq/live-common/lib/types'

import type { T, Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'

import Modal, { ModalContent, ModalTitle, ModalFooter, ModalBody } from 'components/base/Modal'
import Box from 'components/base/Box'
import Breadcrumb from 'components/Breadcrumb'

import StepChooseCurrency, { StepChooseCurrencyFooter } from './steps/01-step-choose-currency'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/02-step-connect-device'
import StepInProgress from './steps/03-step-in-progress'
import StepFinish from './steps/04-step-finish'

const createSteps = ({ t }: { t: T }) => [
  {
    id: 'chooseCurrency',
    label: t('importAccounts:breadcrumb.informations'),
    component: StepChooseCurrency,
    footer: StepChooseCurrencyFooter,
    hideFooter: false,
  },
  {
    id: 'connectDevice',
    label: t('importAccounts:breadcrumb.connectDevice'),
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    hideFooter: false,
  },
  {
    id: 'import',
    label: t('importAccounts:breadcrumb.import'),
    component: StepInProgress,
    footer: null,
    hideFooter: true,
  },
  {
    id: 'finish',
    label: t('importAccounts:breadcrumb.finish'),
    component: StepFinish,
    hideFooter: false,
    footer: StepChooseCurrencyFooter,
  },
]

type Props = {
  t: T,
  currentDevice: ?Device,
}

type StepId = 'chooseCurrency' | 'connectDevice' | 'import' | 'finish'

export type StepProps = {
  t: T,
  currency: ?Currency,
  currentDevice: ?Device,
  isAppOpened: boolean,
  transitionTo: StepId => void,
  setState: any => void,
}

type State = {
  stepId: StepId,
  isAppOpened: boolean,
  currency: ?Currency,
  scannedAccounts: [],
}

const mapStateToProps = state => ({
  currentDevice: getCurrentDevice(state),
})

const INITIAL_STATE = {
  stepId: 'chooseCurrency',
  isAppOpened: false,
  currency: null,
  scannedAccounts: [],
}

class ImportAccounts extends PureComponent<Props, State> {
  state = INITIAL_STATE
  STEPS = createSteps({
    t: this.props.t,
  })

  transitionTo = stepId => {
    this.setState({ stepId })
  }

  render() {
    const { t, currentDevice } = this.props
    const { stepId, currency, isAppOpened } = this.state

    const stepIndex = this.STEPS.findIndex(s => s.id === stepId)
    const step = this.STEPS[stepIndex]

    if (!step) {
      throw new Error(`ImportAccountsModal: step ${stepId} doesn't exists`)
    }

    const { component: StepComponent, footer: StepFooter, hideFooter } = step

    const stepProps: StepProps = {
      t,
      currency,
      currentDevice,
      isAppOpened,
      transitionTo: this.transitionTo,
      setState: (...args) => this.setState(...args),
    }

    return (
      <Modal
        name="importAccounts"
        preventBackdropClick
        onHide={() => this.setState({ ...INITIAL_STATE })}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{t('importAccounts:title')}</ModalTitle>
            <ModalContent>
              <Breadcrumb mb={6} currentStep={stepIndex} items={this.STEPS} />
              <StepComponent {...stepProps} />
            </ModalContent>
            {!hideFooter && (
              <ModalFooter>
                <Box horizontal alignItems="center" justifyContent="flex-end">
                  {StepFooter ? <StepFooter {...stepProps} /> : <Box>footer</Box>}
                </Box>
              </ModalFooter>
            )}
          </ModalBody>
        )}
      />
    )
  }
}

export default compose(connect(mapStateToProps), translate())(ImportAccounts)
