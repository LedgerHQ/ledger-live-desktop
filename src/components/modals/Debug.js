// @flow
/* eslint-disable react/jsx-no-literals */
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { getDerivationScheme, runDerivationScheme } from '@ledgerhq/live-common/lib/derivation'
import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'
import { getCurrentDevice } from 'reducers/devices'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import getAddress from 'commands/getAddress'
import testInterval from 'commands/testInterval'
import testCrash from 'commands/testCrash'
import testApdu from 'commands/testApdu'
import ping from 'commands/ping'
import libcoreGetVersion from 'commands/libcoreGetVersion'
import SyncSkipUnderPriority from '../SyncSkipUnderPriority'

class Debug extends Component<*, *> {
  state = {
    logs: [],
    apdu: '',
  }

  onStartPeriod = (period: number) => () => {
    this.periodSubs.push(
      testInterval.send(period).subscribe(n => this.log(`interval ${n}`), this.error),
    )
  }

  onInternalCrash = () => {
    testCrash.send().subscribe({
      error: this.error,
    })
  }

  onCrashHere = () => {
    throw new Error('CrashTest')
  }

  onClickStressDevice = (device: *) => async () => {
    try {
      const currency = getCryptoCurrencyById('bitcoin')
      const derivationScheme = getDerivationScheme({
        currency,
        derivationMode: 'segwit',
      })
      for (let x = 0; x < 20; x++) {
        const { address, path } = await getAddress
          .send({
            path: runDerivationScheme(derivationScheme, currency, { account: x }),
            currencyId: currency.id,
            devicePath: device.path,
          })
          .toPromise()
        this.log(`derivated ${path} = ${address}`)
      }
    } catch (e) {
      this.error(e)
    }
  }

  onHide = () => {
    this.setState({ logs: [] })
  }

  cancelAllPeriods = () => {
    this.periodSubs.forEach(s => s.unsubscribe())
    this.periodSubs = []
  }
  periodSubs = []

  runApdu = (device: *) => () => {
    testApdu
      .send({ devicePath: device.path, apduHex: this.state.apdu })
      .subscribe(o => this.log(o.responseHex), e => this.error(e))
  }

  benchmark = (device: *) => async () => {
    const run = async (name, job) => {
      const before = window.performance.now()
      const res = await job()
      const after = window.performance.now()
      this.log(
        `benchmark: ${Math.round((after - before) * 100) / 100}ms: ${name} => ${String(res)}`,
      )
    }

    await run('ping process', () => ping.send().toPromise())
    await run('libcore version', () =>
      libcoreGetVersion
        .send()
        .toPromise()
        .then(o => o.stringVersion),
    )
    const currency = getCryptoCurrencyById('bitcoin')
    const derivationScheme = getDerivationScheme({
      currency,
      derivationMode: 'segwit',
    })
    const obj = {
      path: runDerivationScheme(derivationScheme, currency),
      currencyId: currency.id,
      devicePath: device.path,
    }
    await run('getAddress', () =>
      getAddress
        .send(obj)
        .toPromise()
        .then(o => o.address),
    )
  }

  log = (txt: string) => {
    this.setState(({ logs }) => ({ logs: logs.concat({ txt, type: 'log' }) }))
  }

  error = (e: Error) => {
    this.setState(({ logs }) => ({
      logs: logs.concat({ txt: String((e && e.message) || e), type: 'error' }),
    }))
  }

  render() {
    const { device } = this.props
    const { logs } = this.state
    return (
      <Modal name="MODAL_DEBUG" centered onHide={this.onHide}>
        <ModalBody
          title="developer internal tools"
          render={() => (
            <Box>
              <SyncSkipUnderPriority priority={99999999} />
              <Box style={{ height: 60, overflow: 'auto' }}>
                {device && (
                  <Box horizontal style={{ padding: 10 }}>
                    <Button onClick={this.benchmark(device)} primary>
                      Benchmark
                    </Button>
                  </Box>
                )}
                {device && (
                  <Box horizontal style={{ padding: 10 }}>
                    <Button onClick={this.onClickStressDevice(device)} primary>
                      Derivate BTC addresses
                    </Button>
                  </Box>
                )}
                <Box horizontal style={{ padding: 10 }}>
                  <Button mr={2} onClick={this.onInternalCrash} danger>
                    crash internal
                  </Button>
                  <Button onClick={this.onCrashHere} danger>
                    crash here
                  </Button>
                </Box>
                <Box horizontal style={{ padding: 10 }}>
                  <Button onClick={this.onStartPeriod(1000)} primary>
                    interval(1s)
                  </Button>
                  <Button onClick={this.cancelAllPeriods}>Cancel</Button>
                </Box>
                device && (
                <Box horizontal style={{ padding: 10 }}>
                  <Box grow>
                    <Input
                      placeholder="APDU hex ( e.g. E016000000 )"
                      value={this.state.apdu}
                      onChange={apdu => this.setState({ apdu })}
                    />
                  </Box>
                  <Button onClick={this.runApdu(device)} primary>
                    RUN
                  </Button>
                </Box>
                )
              </Box>
              <Box
                style={{
                  padding: '20px 10px',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  background: '#eee',
                  height: 300,
                  overflow: 'auto',
                }}
              >
                {logs.map(log => (
                  <Box
                    key={log.txt}
                    style={{
                      userSelect: 'all',
                      color: log.type === 'error' ? '#c22' : '#888',
                    }}
                  >
                    {log.txt}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <Fragment>
              <Button
                style={{ position: 'absolute', right: 30, bottom: 28 }}
                onClick={() => {
                  this.setState({ logs: [] })
                }}
              >
                Clear
              </Button>
            </Fragment>
          )}
        />
      </Modal>
    )
  }
}

export default connect(
  createStructuredSelector({
    device: getCurrentDevice,
  }),
)(Debug)
