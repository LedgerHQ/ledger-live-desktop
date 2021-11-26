// @flow

import React, { useRef } from "react";
import SwapConnectWidget from "../SwapConnectWidget";
import { getFTXURL } from "../utils";

// FIXME: should use constant instead of string
const provider = "ftx";

const url = getFTXURL("login");

type Props = { onClose: Function };

const FTXLogin = ({ onClose }: Props) => {
  const webviewRef = useRef(null);

  return <SwapConnectWidget provider={provider} onClose={onClose} url={url} ref={webviewRef} />;
};

export default FTXLogin;
