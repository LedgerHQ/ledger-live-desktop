// @flow
import React, { PureComponent } from "react";
import Modal from "~/renderer/components/Modal";
import fetch from "node-fetch";

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

class ImportExchangeModal extends PureComponent<{}, State> {
  state = INITIAL_STATE;

  handleReset = () => this.setState({ ...INITIAL_STATE });

  handleOnSubmit = () => {
    const exchange = this.state.exchange;
    const name = this.state.name;
    const apiKey = this.state.api_key;
    const apiSecret = this.state.api_secret;
    const options = {
      method: "PUT",
      path: `http://127.0.0.1:4242/api/1/exchanges`,
      accept: "application/json;charset=UTF-8",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        location: exchange,
        api_key: apiKey,
        api_secret: apiSecret,
      }),
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
        name="MODAL_IMPORT_EXCHANGE_DATA"
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

export default ImportExchangeModal;
