// @flow
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Box from "~/renderer/components/Box";
import { Redirect } from "react-router";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { aggregateNFTs } from "@ledgerhq/live-common/lib/nft";
import Header from "./Header";
import NftList from "./NftList";

const opts = {
  sortBy: "default",
};

export default function AccountsPage() {
  const rawAccounts = useSelector(accountsSelector);
  const nfts = useMemo(() => aggregateNFTs(rawAccounts, opts), [rawAccounts, opts]);

  if (!rawAccounts.length) {
    return <Redirect to="/" />;
  }

  return (
    <Box>
      <Header />
      <NftList nfts={nfts} />
    </Box>
  );
}
