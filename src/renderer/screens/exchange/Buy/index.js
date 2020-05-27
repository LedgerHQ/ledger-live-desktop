// @flow

import React, { useState, useCallback } from "react";
import SelectAccountAndCurrency from "./SelectAccountAndCurrency";
import styled from "styled-components";
import CoinifyWidget from "../CoinifyWidget";
import DeviceVerify from "../DeviceVerify";

const BuyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Buy = () => {
  const [state, setState] = useState({
    account: null,
    firstDeviceCheck: null,
  });

  const { account, firstDeviceCheck } = state;

  const selectAccount = useCallback((account: Account) => {
    setState(oldState => ({
      ...oldState,
      account,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      account: null,
      firstDeviceCheck: null,
    });
  }, []);

  const confirmAccount = useCallback((account: Account) => {
    setState(oldState => ({
      ...oldState,
      firstDeviceCheck: true,
    }));
  }, []);

  return (
    <BuyContainer>
      {account && firstDeviceCheck === null ? (
        <DeviceVerify
          account={state.account}
          onResult={() => {
            confirmAccount();
          }}
          onCancel={reset}
        />
      ) : null}
      {account && firstDeviceCheck ? (
        <CoinifyWidget account={account} mode="buy" onReset={reset} />
      ) : (
        <SelectAccountAndCurrency selectAccount={selectAccount} />
      )}
    </BuyContainer>
  );
};

export default Buy;
