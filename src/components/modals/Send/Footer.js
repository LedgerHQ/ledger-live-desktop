// @flow

import React, { PureComponent } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { exchangeSettingsForAccountSelector } from 'reducers/settings'

import type { T } from 'types/common'

import { ModalFooter } from 'components/base/Modal'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Label from 'components/base/Label'
import Text from 'components/base/Text'
import type { WalletBridge } from 'bridge/types'

type Props = {
  t: T,
  account: Account,
  bridge: WalletBridge<*>,
  transaction: *,
  onNext: () => void,
  canNext: boolean,
  showTotal: boolean,
  exchange: string,
}

const mapStateToProps = createStructuredSelector({
  exchange: exchangeSettingsForAccountSelector,
})

class Footer extends PureComponent<
  Props,
  {
    totalSpent: number,
    canBeSpent: boolean,
  },
> {
  state = {
    totalSpent: 0,
    canBeSpent: true,
  }
  componentDidMount() {
    this.resync()
  }
  componentDidUpdate(nextProps) {
    if (
      nextProps.account !== this.props.account ||
      nextProps.transaction !== this.props.transaction
    ) {
      this.resync()
    }
  }
  componentWillUnmount() {
    this.unmount = true
  }
  unmount = false
  async resync() {
    const { account, bridge, transaction } = this.props
    const totalSpent = await bridge.getTotalSpent(account, transaction)
    const canBeSpent = await bridge.canBeSpent(account, transaction)
    if (this.unmount) return
    this.setState({ totalSpent, canBeSpent })
  }
  render() {
    const { exchange, account, t, onNext, canNext, showTotal } = this.props
    const { totalSpent, canBeSpent } = this.state
    return (
      <ModalFooter>
        <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
          {showTotal && (
            <Box grow>
              <Label>{t('send:totalSpent')}</Label>
              <Box horizontal flow={2} align="center">
                <FormattedVal
                  disableRounding
                  color="dark"
                  val={totalSpent}
                  unit={account.unit}
                  showCode
                />
                <Box horizontal align="center">
                  <Text ff="Rubik" fontSize={3}>
                    {'('}
                  </Text>
                  <CounterValue
                    exchange={exchange}
                    currency={account.currency}
                    value={totalSpent}
                    disableRounding
                    color="grey"
                    fontSize={3}
                    showCode
                    alwaysShowSign={false}
                  />
                  <Text ff="Rubik" fontSize={3}>
                    {')'}
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
          <Button primary onClick={onNext} disabled={!canNext || !canBeSpent}>
            {'Next'}
          </Button>
        </Box>
      </ModalFooter>
    )
  }
}

export default connect(mapStateToProps)(Footer)
