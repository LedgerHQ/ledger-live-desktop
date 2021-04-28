// @flow

import React, { useState } from "react";
import Providers from "~/renderer/screens/exchange/swap/Providers";
import FormOrHistory from "~/renderer/screens/exchange/swap/FormOrHistory";

const SwapEntrypoint = () => {
  const [provider, setProvider] = useState();

  return provider === "changelly" ? (
    <FormOrHistory provider={"changelly"} />
  ) : (
    <Providers onContinue={setProvider} />
  );
};

export default SwapEntrypoint;
