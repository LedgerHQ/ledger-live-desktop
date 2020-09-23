// @flow
import React from "react";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import { makeClosedHistoryForAccounts } from "@ledgerhq/live-common/lib/compound/logic";
import type { AccountLikeArray } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import ClosedLoans from "./ClosedLoans";

type Props = {
  accounts: AccountLikeArray,
  summaries: CompoundAccountSummary[],
};

const Closed = ({ accounts, summaries }: Props) => {
  const closedLoans = makeClosedHistoryForAccounts(summaries);

  return (
    <Box>
      <ClosedLoans loans={closedLoans} />
    </Box>
  );
};

export default Closed;
