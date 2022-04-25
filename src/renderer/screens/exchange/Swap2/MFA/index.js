// @flow

import React from "react";

import FTXMfa from "./FTX";

// Component to display a partner MFA / 2FA flow
const MFA = ({ provider, onClose }: { provider: string, onClose: Function }) => {
  switch (provider) {
    case "ftxus":
    case "ftx":
      return <FTXMfa onClose={onClose} provider={provider} />;

    default:
      return null;
  }
};

export default MFA;
