// @flow

import React from "react";
import SwapConnectFTX from "../SwapConnectFTX";

import WyreKYC from "./Wyre";

const KYC = ({ provider, onClose }: { provider: string, onClose: Function }) => {
  switch (provider) {
    case "wyre":
      return <WyreKYC onClose={onClose} />;

    case "ftx":
      return <SwapConnectFTX provider={provider} type="kyc" onClose={onClose} />;

    default:
      return null;
  }
};

export default KYC;
