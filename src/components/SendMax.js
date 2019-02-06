// @flow

import React, { PureComponent } from 'react'
import invariant from 'invariant'
import { translate, Trans } from 'react-i18next'

import type { Account } from '@ledgerhq/live-common/lib/types'

import logger from 'logger'

import Spinner from 'components/base/Spinner'
import Tooltip from 'components/base/Tooltip'
import FakeLink from 'components/base/FakeLink'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { WalletBridge } from 'bridge/types'

type Props<Transaction> = {
  t: *,
  bridge: WalletBridge<Transaction>,
  account: Account,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
}

type State = {
  isLoading: boolean,
}

class SendMax extends PureComponent<Props<*>, State> {
  state = {
    isLoading: false,
  }

  handleClick = async () => {
    const { bridge, account, transaction, onChangeTransaction } = this.props
    this.setState({ isLoading: true })
    try {
      invariant(bridge.getMaxAmount, 'bridge should implement `getMaxAmount`')
      const max = await bridge.getMaxAmount(account, transaction)
      onChangeTransaction(bridge.editTransactionAmount(account, transaction, max))
    } catch (err) {
      logger.error(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }
  renderTooltip = () => this.props.t('send.steps.amount.maxDesc')
  render() {
    const { isLoading } = this.state

    const LabelWrapper = isLoading ? Text : FakeLink

    const inner = (
      <Box horizontal align="center" fontSize={3} flow={1}>
        {'('}
        <LabelWrapper fontSize={3} onClick={isLoading ? undefined : this.handleClick}>
          <Trans i18nKey="send.steps.amount.max" />
        </LabelWrapper>
        {isLoading && (
          <Box ml={1}>
            <Spinner size={8} />
          </Box>
        )}
        {')'}
      </Box>
    )

    if (isLoading) {
      return inner
    }

    return <Tooltip render={this.renderTooltip}>{inner}</Tooltip>
  }
}

export default translate()(SendMax)
