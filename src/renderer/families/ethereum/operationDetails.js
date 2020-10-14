// @flow
import React from "react";
import { Trans } from "react-i18next";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";

import Box from "~/renderer/components/Box";
import { OpDetailsTitle, OpDetailsData } from "~/renderer/modals/OperationDetails/styledComponents";

type OperationDetailsExtraProps = {
  extra: { [key: string]: string },
  type: string,
  account: ?AccountLike,
};

const OperationDetailsExtra = ({ extra, type }: OperationDetailsExtraProps) => {
  // $FlowFixMe somehting wrong with .map
  return (type === "REDEEM" || type === "SUPPLY"
    ? Object.entries(extra).filter(([key]) => !["compoundValue", "rate"].includes(key))
    : Object.entries(extra)
  ).map(([key, value]) => (
    <Box key={key}>
      <OpDetailsTitle>
        <Trans i18nKey={`operationDetails.extra.${key}`} defaults={key} />
      </OpDetailsTitle>
      <OpDetailsData>{value}</OpDetailsData>
    </Box>
  ));
};

export default {
  OperationDetailsExtra,
};
