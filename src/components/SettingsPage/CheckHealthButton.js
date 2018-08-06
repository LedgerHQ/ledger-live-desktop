// @flow

import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Check from 'icons/Check'
import TranslatedError from 'components/TranslatedError'

import healthCheck from 'commands/healthCheck'

type Props = {
  t: T,
}

type State = {
  error: ?Error,
  checking: boolean,
  done: boolean,
}

class CheckHealthButton extends PureComponent<Props, State> {
  state = {
    error: null,
    checking: false,
    done: false,
  }
  checkHealth = async () => {
    this.setState({ error: null, checking: true })
    try {
      await healthCheck.send().toPromise()
      this.setState({ checking: false, done: true })
    } catch (err) {
      this.setState({ error: err, checking: false, done: true })
    }
  }

  renderBtnBody = () => {
    const { checking, error, done } = this.state
    const { t } = this.props

    if (!done && !checking) {
      return t('app:settings.healthCheck.btn')
    }

    return error ? (
      <TranslatedError error={error} />
    ) : (
      <Fragment>
        <Box flex horizontal align="center">
          <span style={{ marginRight: 10 }}>{t('app:settings.healthCheck.btnDone')}</span>
          <Check size={20} />
        </Box>
      </Fragment>
    )
  }

  render() {
    return (
      <Button small primary onClick={this.checkHealth} isLoading={this.state.checking}>
        {this.renderBtnBody()}
      </Button>
    )
  }
}

export default translate()(CheckHealthButton)
