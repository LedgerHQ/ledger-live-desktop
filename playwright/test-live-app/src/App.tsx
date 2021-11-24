import { useEffect, useRef } from "react";
import LedgerLiveApi, { WindowMessageTransport } from "@ledgerhq/live-app-sdk";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  // Define the Ledger Live API variable used to call api methods
  const api = useRef<LedgerLiveApi>();

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

  // A very basic test call to request an account
  const requestAccount = async () => {
    if (!api.current) {
      return;
    }

    const result = await api.current
      .requestAccount()
      .catch((error) => console.error({ error }));

    console.log({ result });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          incredible test app
        </a>
        <button onClick={requestAccount}>Request account</button>
      </header>
    </div>
  );
};

export default App;
