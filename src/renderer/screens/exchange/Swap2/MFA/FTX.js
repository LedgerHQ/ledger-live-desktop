// @flow

import React, { useRef, useMemo } from "react";

import type { FTXProviders } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { getFTXURL } from "@ledgerhq/live-common/lib/exchange/swap/utils";

import SwapConnectWidget from "../SwapConnectWidget";

type Props = { onClose: Function, provider: FTXProviders };

const FTXMfa = ({ onClose, provider }: Props) => {
  const url = useMemo(() => getFTXURL({ type: "mfa", provider }), [provider]);

  const webviewRef = useRef(null);

  return <SwapConnectWidget provider={provider} onClose={onClose} url={url} ref={webviewRef} />;
};

export default FTXMfa;
