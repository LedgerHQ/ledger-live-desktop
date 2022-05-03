// @flow
import React, { useMemo, useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft/helpers";
import { hiddenNftCollectionsSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Option from "./Option";

const SelectNFT = ({
  onSelect,
  maybeNFTId,
  maybeNFTCollection,
  account,
}: {
  onSelect: any => void,
  maybeNFTId?: string,
  maybeNFTCollection?: string,
  account: Account,
}) => {
  const [token, setToken] = useState(null);
  const getOptionValue = useCallback(item => item, []);

  const hiddenNftCollections = useSelector(hiddenNftCollectionsSelector);
  const filteredNFTs = useMemo(
    () =>
      maybeNFTCollection
        ? nftsByCollections(account.nfts, maybeNFTCollection)
        : account.nfts?.filter(
            nft => !hiddenNftCollections.includes(`${account.id}|${nft.contract}`),
          ) || [],
    [maybeNFTCollection, account.nfts, account.id, hiddenNftCollections],
  );

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
