// @flow
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'
import last from 'lodash/last'
import React, { Component } from 'react'
import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import EnsureDevice from 'components/ManagerPage/EnsureDevice'
import { getDerivations } from 'helpers/derivations'
import getAddress from 'commands/getAddress'
import testInterval from 'commands/testInterval'
import testCrash from 'commands/testCrash'
import testApdu from 'commands/testApdu'

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

  runApdu = (device: *) => () => {
    testApdu
      .send({ devicePath: device.path, apduHex: this.state.apdu })
      .subscribe(o => this.log(o.responseHex), e => this.error(e))
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
                <EnsureDevice>
                  {device => (
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
                  )}
                </EnsureDevice>
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
