/* eslint-disable consistent-return */
// @flow
import React, { useCallback } from "react";

import { BigNumber } from "bignumber.js";

import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import type { Vote } from "@ledgerhq/live-common/lib/families/tron/types";

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
import {
  useTronSuperRepresentatives,
  formatVotes,
} from "@ledgerhq/live-common/lib/families/tron/react";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";

const helpURL = "https://support.ledger.com/hc/en-us/articles/360013062139";

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
  votes: ?Array<Vote>,
  account: Account,
  isTransactionField?: boolean,
};

export const OperationDetailsVotes = ({
  votes,
  account,
  isTransactionField,
}: OperationsDetailsVotesProps) => {
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
      {!isTransactionField && (
        <OpDetailsTitle>
          <Trans
            i18nKey={"operationDetails.extra.votes"}
            values={{ number: votes && votes.length }}
          />
        </OpDetailsTitle>
      )}

      {sp.length > 0 &&
        formattedVotes &&
        formattedVotes.length > 0 &&
        formattedVotes.map(({ voteCount, address, validator }, i) => (
          <OpDetailsData key={address + i}>
            <OpDetailsVoteData>
              <Box>
                <Text>
                  <Trans
                    i18nKey="operationDetails.extra.votesAddress"
                    values={{ votes: voteCount, name: validator && validator.name }}
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
      if (!votes || !votes.length) return null;

      return <OperationDetailsVotes votes={votes} account={account} />;
    }
    case "FREEZE":
      return (
        <Box>
          <OpDetailsTitle>
            <Trans i18nKey="operationDetails.extra.frozenAmount" />
          </OpDetailsTitle>
          <OpDetailsData>
            <FormattedVal
              val={BigNumber(extra.frozenAmount)}
              unit={account.unit}
              showCode
              fontSize={4}
              color="palette.text.shade60"
            />
          </OpDetailsData>
        </Box>
      );
    case "UNFREEZE":
      return (
        <Box>
          <OpDetailsTitle>
            <Trans i18nKey="operationDetails.extra.unfreezeAmount" />
          </OpDetailsTitle>
          <OpDetailsData>
            <FormattedVal
              val={BigNumber(extra.unfreezeAmount)}
              unit={account.unit}
              showCode
              fontSize={4}
              color="palette.text.shade60"
            />
          </OpDetailsData>
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
