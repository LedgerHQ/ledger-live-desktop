// @flow
import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import votesImage from "~/renderer/images/votes.svg";
import { useAccount } from "../shared";

export default function VoteTronInfoModalBodyMain() {
  const accountContext = useAccount();
  const account = accountContext && accountContext.account;

  return (
    <Box flow={4} mx={4}>
      <TrackPage category="Voting Flow" name="Step Vote" />
      {account ? <SyncOneAccountOnMount priority={10} accountId={account.id} /> : null}

      <Box flow={1} alignItems="center">
        <Box mb={4}>
          <Img src={votesImage} />
        </Box>

        <Box mb={4}>
          <Text ff="Inter|SemiBold" fontSize={4} textAlign="center">
            <Trans i18nKey="tron.manage.vote.steps.vote.description" />
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

const Img = styled.img`
  width: 160px;
  height: auto;
`;
