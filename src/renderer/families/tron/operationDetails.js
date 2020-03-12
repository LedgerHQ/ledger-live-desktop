/* eslint-disable consistent-return */
// @flow
import React, { useCallback } from "react";

import type { Account, Operation } from "@ledgerhq/live-common/lib/types";

import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { openURL } from "~/renderer/linking";

import {
  OpDetailsTitle,
  Address,
  OpDetailsData,
  OpDetailsVoteData,
} from "~/renderer/modals/OperationDetails/styledComponents";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import { useTronSuperRepresentatives, formatVotes } from "./Votes/index";
import Text from "~/renderer/components/Text";

const helpURL = "https://support.ledger.com/hc/en-us/articles/360010653260";

function getURLFeesInfo(op: Operation): ?string {
  if (op.fee.gt(200000)) {
    return helpURL;
  }
}

function getURLWhatIsThis(op: Operation): ?string {
  if (op.type !== "IN" && op.type !== "OUT") {
    return helpURL;
  }
}

type OperationsDetailsVotesProps = {
  votes: Array<{ address: string, count: number }>,
  account: Account,
};

const OperationDetailsVotes = ({ votes, account }: OperationsDetailsVotesProps) => {
  const sp = useTronSuperRepresentatives();
  const formattedVotes = formatVotes(votes, sp);

  const redirectAddress = useCallback(
    address => {
      const url = getAddressExplorer(getDefaultExplorerView(account.currency), address);
      if (url) openURL(url);
    },
    [account],
  );

  return (
    <Box>
      <OpDetailsTitle>
        <Trans i18nKey={"operationDetails.extra.votes"} values={{ number: votes.length }} />
      </OpDetailsTitle>

      {formattedVotes &&
        formattedVotes.map(({ count, validator: { address, name } = {} }, i) => (
          <OpDetailsData key={address}>
            <OpDetailsVoteData>
              <Box>
                <Text>
                  <Trans
                    i18nKey="operationDetails.extra.votesAddress"
                    values={{ votes: count, name }}
                  >
                    <b>{""}</b>
                    {""}
                    <b>{""}</b>
                  </Trans>
                </Text>
              </Box>
              <Address onClick={() => redirectAddress(address)}>{address}</Address>
            </OpDetailsVoteData>
          </OpDetailsData>
        ))}
    </Box>
  );
};

type OperationDetailsExtraProps = {
  extra: { [key: string]: any },
  type: string,
  account: Account,
};

const OperationDetailsExtra = ({ extra, type, account }: OperationDetailsExtraProps) => {
  switch (type) {
    case "VOTE": {
      const { votes } = extra;
      if (!votes && votes.length) return null;

      return <OperationDetailsVotes votes={votes} account={account} />;
    }
    /** @TODO use formatted number value for the amount */
    case "FREEZE":
      return (
        <Box>
          <OpDetailsTitle>
            <Trans i18nKey="operationDetails.extra.frozenAmount" />
          </OpDetailsTitle>
          <OpDetailsData>{extra.frozenAmount}</OpDetailsData>
        </Box>
      );
    /** @TODO use formatted number value for the amount */
    case "UNFREEZE":
      return (
        <Box>
          <OpDetailsTitle>
            <Trans i18nKey="operationDetails.extra.unfreezeAmount" />
          </OpDetailsTitle>
          <OpDetailsData>{extra.unfreezeAmount}</OpDetailsData>
        </Box>
      );
    default:
      return null;
  }
};

export default {
  getURLFeesInfo,
  getURLWhatIsThis,
  OperationDetailsExtra,
};
