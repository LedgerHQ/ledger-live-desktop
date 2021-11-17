// @flow
import React, { useMemo, useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import Select from "~/renderer/components/Select";
import { getAllNFTs } from "~/renderer/reducers/accounts";
import Option from "./Option";

const SelectNFT = ({
  onSelect,
  maybeNFTId,
  maybeNFTCollection,
}: {
  onSelect: any => void,
  maybeNFTId?: string,
  maybeNFTCollection?: string,
}) => {
  const [token, setToken] = useState(null);
  const getOptionValue = useCallback(item => item, []);
  const allNFTs = useSelector(getAllNFTs);

  const filteredNFTs = useMemo(
    () =>
      maybeNFTCollection
        ? allNFTs.filter(nft => nft.collection.contract === maybeNFTCollection)
        : allNFTs,
    [allNFTs, maybeNFTCollection],
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
