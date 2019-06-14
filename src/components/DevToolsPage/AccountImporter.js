// @flow

/* eslint-disable react/no-multi-comp */

import React, { PureComponent, Fragment } from 'react'
import invariant from 'invariant'
import { connect } from 'react-redux'
import type { CryptoCurrency, Account, DerivationMode } from '@ledgerhq/live-common/lib/types'
import { fromAccountRaw } from '@ledgerhq/live-common/lib/account'
import { addAccount } from 'actions/accounts'
import { idleCallback } from 'helpers/promise'
import scanFromXPUB from 'commands/libcoreScanFromXPUB'
import FakeLink from 'components/base/FakeLink'
import Ellipsis from 'components/base/Ellipsis'
import Switch from 'components/base/Switch'
import Spinner from 'components/base/Spinner'
import Box, { Card } from 'components/base/Box'
import TranslatedError from 'components/TranslatedError'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import SelectCurrency from 'components/SelectCurrency'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'

const mapDispatchToProps = {
  addAccount,
}

type Props = {
  addAccount: Account => void,
}

type ImportableAccountType = {
  name: string,
  currency: CryptoCurrency,
  derivationMode: DerivationMode,
  xpub: string,
}

type State = {
  status: string,

  importableAccounts: ImportableAccountType[],

  currency: ?CryptoCurrency,
  xpub: string,
  name: string,
  isSegwit: boolean,
  isUnsplit: boolean,

  error: ?Error,
}

const INITIAL_STATE = {
  status: 'idle',

  currency: null,
  xpub: '',
  name: 'dev',
  isSegwit: true,
  isUnsplit: false,

  error: null,
  importableAccounts: [],
}

class AccountImporter extends PureComponent<Props, State> {
  state = INITIAL_STATE

  onChangeCurrency = (currency: CryptoCurrency) => {
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
  onChangeName = name => this.setState({ name })

  isValid = () => {
    const { currency, xpub, status } = this.state
    return !!currency && !!xpub && status !== 'scanning'
  }

  scan = async () => {
    this.setState({ status: 'scanning' })
    const { importableAccounts } = this.state
    try {
      for (let i = 0; i < importableAccounts.length; i++) {
        const a = importableAccounts[i]
        const scanPayload = {
          seedIdentifier: `dev_${a.xpub}`,
          currencyId: a.currency.id,
          xpub: a.xpub,
          derivationMode: a.derivationMode,
        }
        const rawAccount = await scanFromXPUB.send(scanPayload).toPromise()
        const account = fromAccountRaw(rawAccount)
        await this.import({
          ...account,
          name: a.name,
        })
        this.removeImportableAccount(a)
      }
      this.reset()
    } catch (error) {
      this.setState({ status: 'error', error })
    }
  }

  addToScan = () => {
    const { xpub, currency, isSegwit, isUnsplit, name } = this.state
    if (!currency) return
    const derivationMode = isSegwit
      ? isUnsplit
        ? 'segwit_unsplit'
        : 'segwit'
      : isUnsplit
      ? 'unsplit'
      : ''
    const importableAccount = { xpub, currency, derivationMode, name }
    this.setState(({ importableAccounts }) => ({
      importableAccounts: [...importableAccounts, importableAccount],
      currency: null,
      xpub: '',
      name: 'dev',
      isSegwit: true,
      isUnsplit: false,
    }))
  }

  removeImportableAccount = importableAccount => {
    this.setState(({ importableAccounts }) => ({
      importableAccounts: importableAccounts.filter(i => i.xpub !== importableAccount.xpub),
    }))
  }

  import = async account => {
    invariant(account, 'no account')
    await idleCallback()
    this.props.addAccount(account)
  }

  reset = () => this.setState(INITIAL_STATE)

  render() {
    const {
      currency,
      xpub,
      name,
      isSegwit,
      isUnsplit,
      status,
      error,
      importableAccounts,
    } = this.state
    const supportsSplit = !!currency && !!currency.forkedFrom
    return (
      <Fragment>
        <Card title="Import from xpub" flow={3}>
          {status === 'idle' || status === 'scanning' ? (
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
                  onEnter={this.addToScan}
                />
              </Box>
              <Box flow={1}>
                <Label>{'name'}</Label>
                <Input
                  placeholder="name"
                  value={name}
                  onChange={this.onChangeName}
                  onEnter={this.addToScan}
                />
              </Box>
              <Box align="flex-end">
                <Button primary small disabled={!this.isValid()} onClick={this.addToScan}>
                  {'add to scan'}
                </Button>
              </Box>
            </Fragment>
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
        {!!importableAccounts.length && (
          <Card flow={2}>
            {importableAccounts.map((acc, i) => (
              <ImportableAccount
                key={acc.xpub}
                importableAccount={acc}
                onRemove={this.removeImportableAccount}
                isLoading={status === 'scanning' && i === 0}
              >
                {acc.xpub}
              </ImportableAccount>
            ))}
            {status !== 'scanning' && (
              <Box mt={4} align="flex-start">
                <Button primary onClick={this.scan}>
                  {'Launch scan'}
                </Button>
              </Box>
            )}
          </Card>
        )}
      </Fragment>
    )
  }
}

class ImportableAccount extends PureComponent<{
  importableAccount: ImportableAccountType,
  onRemove: ImportableAccountType => void,
  isLoading: boolean,
}> {
  remove = () => {
    this.props.onRemove(this.props.importableAccount)
  }
  render() {
    const { importableAccount, isLoading } = this.props
    return (
      <Box horizontal flow={2} align="center">
        {isLoading && <Spinner size={16} color="rgba(0, 0, 0, 0.3)" />}
        <CurrencyCircleIcon currency={importableAccount.currency} size={24} />
        <Box grow ff="Rubik" fontSize={3}>
          <Ellipsis>{`[${importableAccount.name}] ${importableAccount.derivationMode ||
            'default'} ${importableAccount.xpub}`}</Ellipsis>
        </Box>
        {!isLoading && (
          <FakeLink onClick={this.remove} fontSize={3}>
            {'Remove'}
          </FakeLink>
        )}
      </Box>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountImporter)
