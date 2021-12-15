// @flow
import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";

type State = {
  exchange: string,
  api_key?: string,
  api_secret?: string,
  name?: string,
};

const INITIAL_STATE = {
  exchange: "kraken",
  api_key: undefined,
  api_secret: undefined,
  name: undefined,
};

class ReceiveModal extends PureComponent<{}, State> {
  state = INITIAL_STATE;

  handleReset = () => this.setState({ ...INITIAL_STATE });

  handleOnSubmit = () => {
    console.log({ state: this.state });
  };

  render() {
    return (
      <Modal
        name="MODAL_IMPORT_EXTERNAL_DATA"
        centered
        onHide={this.handleReset}
        preventBackdropClick={false}
        render={({ data, onClose }) => (
          <div>
            <select
              onChange={event => {
                const { value } = event.target;
                this.setState({ ...this.state, exchange: value });
              }}
            >
              <option value={"kraken"}>Kraken</option>
              <option value={"binance"}>Binance</option>
            </select>
            <input
              onChange={event => {
                const { value } = event.target;
                this.setState({ ...this.state, api_key: value });
              }}
              key={"api_key"}
              type="text"
              placeholder="API Key"
            />
            <input
              onChange={event => {
                const { value } = event.target;
                this.setState({ ...this.state, api_secret: value });
              }}
              key={"api_secret"}
              type="text"
              placeholder="API Secret"
            />
            <input
              onChange={event => {
                const { value } = event.target;
                this.setState({ ...this.state, name: value });
              }}
              key={"name"}
              type="text"
              placeholder="Name"
            />

            <button onClick={() => this.handleOnSubmit()}>Submit</button>
          </div>
        )}
      />
    );
  }
}

export default ReceiveModal;
