import React, { Component } from 'react'
import ledgerco from 'ledgerco'

class App extends Component {
  state = {
    publicKey: null,
  }

  componentWillMount() {
    this.getWalletPublicKey()
  }

  getWalletPublicKey() {
    ledgerco.comm_node.create_async().then(comm => {
      comm.device.setNonBlocking(1)

      const btc = new ledgerco.btc(comm)

      btc.getWalletPublicKey_async("44'/0'/0'/0").then(res =>
        this.setState({
          publicKey: res.publicKey,
        }),
      )
    })
  }

  render() {
    const { publicKey } = this.state

    return <div>publicKey: {publicKey}</div>
  }
}

export default App
