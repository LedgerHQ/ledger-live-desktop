// @flow

import React, { PureComponent, Fragment } from 'react'
import invariant from 'invariant'
import { connect } from 'react-redux'

import type { Currency, Account } from '@ledgerhq/live-common/lib/types'

import { decodeAccount } from 'reducers/accounts'
import { addAccount } from 'actions/accounts'

import FormattedVal from 'components/base/FormattedVal'
import Switch from 'components/base/Switch'
import Spinner from 'components/base/Spinner'
import Box, { Card } from 'components/base/Box'
import TranslatedError from 'components/TranslatedError'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import SelectCurrency from 'components/SelectCurrency'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'

import { idleCallback } from 'helpers/promise'

import scanFromXPUB from 'commands/libcoreScanFromXPUB'

const mapDispatchToProps = {
  addAccount,
}

type Props = {
  addAccount: Account => void,
}

const INITIAL_STATE = {
  status: 'idle',
  currency: null,
  xpub: '',
  account: null,
  isSegwit: true,
  isUnsplit: false,
  error: null,
}

type State = {
  status: string,
  currency: ?Currency,
  xpub: string,
  account: ?Account,
  isSegwit: boolean,
  isUnsplit: boolean,
  error: ?Error,
}

class AccountImporter extends PureComponent<Props, State> {
  state = INITIAL_STATE

  onChangeCurrency = currency => {
    if (currency.family !== 'bitcoin') return
    this.setState({
      currency,
      isSegwit: !!currency.supportsSegwit,
      isUnsplit: false,
    })
  }

  onChangeXPUB = xpub => this.setState({ xpub })
  onChangeSegwit = isSegwit => this.setState({ isSegwit })
  onChangeUnsplit = isUnsplit => this.setState({ isUnsplit })

  isValid = () => {
    const { currency, xpub } = this.state
    return !!currency && !!xpub
  }

  scan = async () => {
    if (!this.isValid()) return
    this.setState({ status: 'scanning' })
    try {
      const { currency, xpub, isSegwit, isUnsplit } = this.state
      invariant(currency, 'no currency')
      const derivationMode = isSegwit
        ? isUnsplit
          ? 'segwit_unsplit'
          : 'segwit'
        : isUnsplit
          ? 'unsplit'
          : ''
      const rawAccount = await scanFromXPUB
        .send({
          seedIdentifier: 'dev_tool',
          currencyId: currency.id,
          xpub,
          derivationMode,
        })
        .toPromise()
      const account = decodeAccount(rawAccount)
      this.setState({ status: 'finish', account })
    } catch (error) {
      this.setState({ status: 'error', error })
    }
  }

  import = async () => {
    const { account } = this.state
    invariant(account, 'no account')
    await idleCallback()
    this.props.addAccount(account)
    this.reset()
  }

  reset = () => this.setState(INITIAL_STATE)

  render() {
    const { currency, xpub, isSegwit, isUnsplit, status, account, error } = this.state
    const supportsSplit = !!currency && !!currency.forkedFrom
    return (
      <Card title="Import from xpub" flow={3}>
        {status === 'idle' ? (
          <Fragment>
            <Box flow={1}>
              <Label>{'currency'}</Label>
              <SelectCurrency autoFocus value={currency} onChange={this.onChangeCurrency} />
            </Box>
            {currency && (currency.supportsSegwit || supportsSplit) ? (
              <Box horizontal justify="flex-end" align="center" flow={3}>
                {supportsSplit && (
                  <Box horizontal align="center" flow={1}>
                    <Box ff="Museo Sans|Bold" fontSize={4}>
                      {'unsplit'}
                    </Box>
                    <Switch isChecked={isUnsplit} onChange={this.onChangeUnsplit} />
                  </Box>
                )}
                {currency.supportsSegwit && (
                  <Box horizontal align="center" flow={1}>
                    <Box ff="Museo Sans|Bold" fontSize={4}>
                      {'segwit'}
                    </Box>
                    <Switch isChecked={isSegwit} onChange={this.onChangeSegwit} />
                  </Box>
                )}
              </Box>
            ) : null}
            <Box flow={1}>
              <Label>{'xpub'}</Label>
              <Input
                placeholder="xpub"
                value={xpub}
                onChange={this.onChangeXPUB}
                onEnter={this.scan}
              />
            </Box>
            <Box align="flex-end">
              <Button primary small disabled={!this.isValid()} onClick={this.scan}>
                {'scan'}
              </Button>
            </Box>
          </Fragment>
        ) : status === 'scanning' ? (
          <Box align="center" justify="center" p={5}>
            <Spinner size={16} />
          </Box>
        ) : status === 'finish' ? (
          account ? (
            <Box p={8} align="center" justify="center" flow={5} horizontal>
              <Box horizontal flow={4} color="graphite" align="center">
                {currency && <CurrencyCircleIcon size={64} currency={currency} />}
                <Box>
                  <Box ff="Museo Sans|Bold">{account.name}</Box>
                  <FormattedVal
                    fontSize={2}
                    alwaysShowSign={false}
                    color="graphite"
                    unit={account.unit}
                    showCode
                    val={account.balance || 0}
                  />
                  <Box fontSize={2}>{`${account.operations.length} operation(s)`}</Box>
                </Box>
              </Box>

              <Button outline small disabled={!account} onClick={this.import}>
                {'import'}
              </Button>
            </Box>
          ) : (
            <Box align="center" justify="center" p={5} flow={4}>
              <Box>{'No accounts found or wrong xpub'}</Box>
              <Button primary onClick={this.reset} small autoFocus>
                {'Reset'}
              </Button>
            </Box>
          )
        ) : status === 'error' ? (
          <Box align="center" justify="center" p={5} flow={4}>
            <Box>
              <TranslatedError error={error} />
            </Box>
            <Button primary onClick={this.reset} small autoFocus>
              {'Reset'}
            </Button>
          </Box>
        ) : null}
      </Card>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountImporter)
