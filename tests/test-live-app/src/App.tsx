import { useEffect, useRef, useState } from "react";
import LedgerLiveApi, { WindowMessageTransport } from "@ledgerhq/live-app-sdk";
import logo from "./ledger-logo.png";
import "./App.css";

const App = () => {
  // Define the Ledger Live API variable used to call api methods
  const api = useRef<LedgerLiveApi>();

  const [output, setOutput] = useState<any>(0);

  (window as any).liveapp = {
    events: {
      getSdkAccounts() {
        return getAccounts();
      },
    },
  };

  // Instantiate the Ledger Live API on component mount
  useEffect(() => {
    const llapi = new LedgerLiveApi(new WindowMessageTransport());
    llapi.connect();
    if (llapi) {
      api.current = llapi;
    }
    // Cleanup the Ledger Live API on component unmount
    return () => {
      api.current = undefined;
      void llapi.disconnect();
    };
  }, []);

  const getAccounts = async () => {
    // if (!api.current) {
    //   return;
    // }

    // console.log(output);

    // const result = await api.current.
    //   listAccounts()
    //   .catch((error) => console.error({ error }));

    // console.log({ result });
    // console.log(output);
    setOutput(output + 1);
    return output;
  };

  const requestAccount = async () => {
    if (!api.current) {
      return;
    }

    const result = await api.current.requestAccount().catch(error => console.error({ error }));

    console.log({ result });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Ledger Live Dummy Test App</h3>
        <p>App for testing the Ledger Live SDK manually and in Automated tests</p>
        <div>
          <button onClick={getAccounts} data-test-id="get-all-accounts-button">
            Get all accounts
          </button>
          <button onClick={requestAccount} data-test-id="request-single-account-button">
            Request account
          </button>
        </div>
        <div>{output}</div>
      </header>
    </div>
  );
};

export default App;
