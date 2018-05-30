// @flow
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'
import last from 'lodash/last'
import React, { Component } from 'react'
import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import EnsureDevice from 'components/ManagerPage/EnsureDevice'
import { getDerivations } from 'helpers/derivations'
import getAddress from 'commands/getAddress'
import testInterval from 'commands/testInterval'
import testCrash from 'commands/testCrash'

class Debug extends Component<*, *> {
  state = {
    logs: [],
  }

  onStartPeriod = (period: number) => () => {
    this.periodSubs.push(
      testInterval.send(period).subscribe(n => this.log(`interval ${n}`), this.error),
    )
  }

  onCrash = () => {
    testCrash.send().subscribe({
      error: this.error,
    })
  }

  onClickStressDevice = (device: *) => async () => {
    try {
      const currency = getCryptoCurrencyById('bitcoin')
      const derivation = last(getDerivations(currency))
      for (let x = 0; x < 20; x++) {
        const obj = {
          path: derivation({ currency, segwit: true, x }),
          currencyId: currency.id,
          devicePath: device.path,
        }

        // we start one in parallel just to stress device even more. this test race condition!
        getAddress.send(obj)
        getAddress.send(obj)

        const { address, path } = await getAddress.send(obj).toPromise()

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

  log = (txt: string) => {
    this.setState(({ logs }) => ({ logs: logs.concat({ txt, type: 'log' }) }))
  }

  error = (e: Error) => {
    this.setState(({ logs }) => ({
      logs: logs.concat({ txt: String((e && e.message) || e), type: 'error' }),
    }))
  }

  render() {
    const { logs } = this.state
    return (
      <Modal
        name="MODAL_DEBUG"
        onHide={this.onHide}
        render={({ onClose }: *) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>developer internal tools</ModalTitle>
            <ModalContent>
              <Box style={{ height: 60, overflow: 'auto' }}>
                <Box horizontal style={{ padding: 10 }}>
                  <EnsureDevice>
                    {device => (
                      <Button onClick={this.onClickStressDevice(device)} primary>
                        Stress getAddress (BTC)
                      </Button>
                    )}
                  </EnsureDevice>
                </Box>
                <Box horizontal style={{ padding: 10 }}>
                  <Button onClick={this.onCrash} danger>
                    crash process
                  </Button>
                </Box>
                <Box horizontal style={{ padding: 10 }}>
                  <Button onClick={this.onStartPeriod(1000)} primary>
                    interval(1s)
                  </Button>
                  <Button onClick={this.cancelAllPeriods}>Cancel</Button>
                </Box>
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
                    style={{
                      userSelect: 'all',
                      color: log.type === 'error' ? '#c22' : '#888',
                    }}
                  >
                    {log.txt}
                  </Box>
                ))}
              </Box>
              <Button
                style={{ position: 'absolute', right: 30, bottom: 28 }}
                onClick={() => {
                  this.setState({ logs: [] })
                }}
              >
                Clear
              </Button>
            </ModalContent>
          </ModalBody>
        )}
      />
    )
  }
}

export default Debug
