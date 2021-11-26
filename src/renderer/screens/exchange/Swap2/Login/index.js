// @flow

import React from "react";

import FTXLogin from "./FTX";

const KYC = ({ provider, onClose }: { provider: string, onClose: Function }) => {
  switch (provider) {
    case "ftx":
      return <FTXLogin onClose={onClose} />;

    default:
      return null;
  }
};

export default KYC;
