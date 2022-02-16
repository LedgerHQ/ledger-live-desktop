// @flow
import React, { useMemo, useEffect, useCallback, useState } from "react";
import type { NFT, Account } from "@ledgerhq/live-common/lib/types";
import Select from "~/renderer/components/Select";
import Option from "./Option";

const SelectNFT = ({
  onSelect,
  maybeNFTId,
  maybeNFTCollection,
  nfts,
  account,
}: {
  onSelect: any => void,
  maybeNFTId?: string,
  maybeNFTCollection?: string,
  nfts: NFT[],
  account: Account,
}) => {
  const [token, setToken] = useState(null);
  const getOptionValue = useCallback(item => item, []);

  const filteredNFTs = useMemo(() => {
    const res = maybeNFTCollection
      ? nfts.filter(nft => nft.collection.contract === maybeNFTCollection)
      : nfts;

    return res.map(nft => ({ ...nft, currency: account.currency }));
  }, [maybeNFTCollection, nfts, account.currency]);

  const onTokenSelected = useCallback(
    token => {
      onSelect(token);
      setToken(token);
    },
    [onSelect],
  );

  useEffect(() => {
    if (filteredNFTs?.length && !token) {
      // Search for the passed nftid, fallback to first nft
      let match = filteredNFTs[0];
      if (maybeNFTId) {
        const maybeMatch = filteredNFTs.find(nft => nft.id === maybeNFTId);
        if (maybeMatch) {
          match = maybeMatch;
        }
      }
      onTokenSelected(match);
    }
  }, [filteredNFTs, maybeNFTId, onTokenSelected, token]);

  return (
    <Select
      isSearchable={false}
      onChange={onTokenSelected}
      options={filteredNFTs}
      value={token}
      rowHeight={50}
      getOptionValue={getOptionValue}
      renderOption={Option}
      renderValue={Option}
      small
    />
  );
};

export default SelectNFT;
