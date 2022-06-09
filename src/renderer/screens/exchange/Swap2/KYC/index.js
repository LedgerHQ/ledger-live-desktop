// @flow

import React from "react";

import FTXKYC from "./FTX";
import WyreKYC from "./Wyre";

// Component to display a partner KYC flow
const KYC = ({ provider, onClose }: { provider: string, onClose: Function }) => {
  switch (provider) {
    case "wyre":
      return <WyreKYC onClose={onClose} />;

    case "ftxus":
    case "ftx":
      return <FTXKYC onClose={onClose} provider={provider} />;

    default:
      return null;
  }
};

export default KYC;
