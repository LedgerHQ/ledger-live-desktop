// @flow
import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";

type State = {
  blockchain: string,
  address: string,
};

const INITIAL_STATE = {
  blockchain: "42161",
  address: undefined,
};

class ReceiveModal extends PureComponent<{}, State> {
  state = INITIAL_STATE;

  handleReset = () => this.setState({ ...INITIAL_STATE });

  handleOnSubmit = () => {
    const blockchain = this.state.blockchain;
    const address = this.state.address;
    const options = {
      method: "GET",
      path: `https://api.covalenthq.com/v1/${blockchain}/address/${address}/balances_v2/?&key=ckey_5f6c60b3b6424f1d96cf65754ce`,
      accept: "application/json;charset=UTF-8",
      headers: { "Content-Type": "application/json" },
    };
    fetch(options.path, options)
      .then(response => response.json())
      .then(userData => {
        //tbd
        console.log(userData);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Modal
        name="MODAL_IMPORT_ADDRESS_DATA"
        centered
        onHide={this.handleReset}
        preventBackdropClick={false}
        render={({ data, onClose }) => (
          <div>
            <select
              onChange={event => {
                const { value } = event.target;
                console.log({ value });
                this.setState({ ...this.state, blockchain: value });
              }}
            >
              <option value={"42161"}>Arbitrum</option>
              <option value={"250"}>Fantom</option>
            </select>

            <input
              onChange={event => {
                const { value } = event.target;
                this.setState({ ...this.state, address: value });
              }}
              key={"address"}
              type="text"
              placeholder="Account address"
            />

            <button onClick={() => this.handleOnSubmit()}>Submit</button>
          </div>
        )}
      />
    );
  }
}

export default ReceiveModal;
