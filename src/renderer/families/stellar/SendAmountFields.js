// @flow
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import SendFeeMode from "./SendFeeMode";
import FeeField from "./FeeField";
import Box from "~/renderer/components/Box";

const Root = (props: *) => {
  const { fees, networkInfo } = props.transaction;
  const isCustomFee = !fees.eq(networkInfo.fees);
  const [isCustomMode, setCustomMode] = useState(isCustomFee);

  const bridge = getAccountBridge(props.account);

  const onFeeModeChange = (isCustom: boolean) => {
    setCustomMode(isCustom);

    if (!isCustom) {
      props.updateTransaction(t => bridge.updateTransaction(t, { fees: networkInfo.fees }));
    }
  };

  return (
    <>
      <SendFeeMode isCustomMode={isCustomMode} setCustomMode={onFeeModeChange} />
      {isCustomMode ? (
        <Box mb={10} horizontal grow>
          <FeeField {...props} />
        </Box>
      ) : null}
    </>
  );
};

export default {
  component: withTranslation()(Root),
  fields: [],
};
