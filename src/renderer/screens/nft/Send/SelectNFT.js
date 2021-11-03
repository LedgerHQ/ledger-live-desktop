// @flow
import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import Select from "~/renderer/components/Select";
import { getAllNFTs } from "~/renderer/reducers/accounts";
import Option from "./Option";

const SelectNFT = ({ onSelect, maybeNFT }: { onSelect: any => void, maybeNFT?: string }) => {
  const getOptionValue = useCallback(item => item, []);
  const allNfts = useSelector(getAllNFTs);
  const [token, setToken] = useState(null);

  const onTokenSelected = useCallback(
    token => {
      onSelect(token);
      setToken(token);
    },
    [onSelect],
  );

  useEffect(() => {
    if (allNfts?.length && !token) {
      // Search for the passed nftid, fallback to first nft
      let match = allNfts[0];
      if (maybeNFT) {
        const maybeMatch = allNfts.find(nft => nft.id === maybeNFT);
        if (maybeMatch) {
          match = maybeMatch;
        }
      }
      onTokenSelected(match);
    }
  }, [allNfts, maybeNFT, onTokenSelected, token]);

  return (
    <Select
      isSearchable={false}
      onChange={onTokenSelected}
      options={allNfts}
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
