// @flow
import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import type { NFT, Account } from "@ledgerhq/live-common/lib/types";
import { getAccountName } from "@ledgerhq/live-common/lib/account";
import { useSortFilterNFTs } from "@ledgerhq/live-common/lib/nft/react";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import Box from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import GridIcon from "~/renderer/icons/Grid";
import ListIcon from "~/renderer/icons/List";
import IconSend from "~/renderer/icons/Send";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import SearchBox from "./SearchBox";
import CollectionSort from "./CollectionSort";
import Order from "./Order";

function canSendNFT(nft) {
  return nft.schema === "ERC721";
}

const List = styled.div`
  display: flex;
  flex-direction: column;
`;
const Grid = styled.div`
  display: flex;
  flex-direction: row;
`;
const Column = styled.div`
  flex: 1;
  > * {
    display: block;
    padding: 24px;
  }
`;

const ToggleButton: ThemedComponent<{ active?: boolean }> = styled(Button)`
  height: 30px;
  width: 30px;
  padding: 7px;
  background: ${p =>
    p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.palette.background.paper};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
`;

const GenericBox: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
  flex: 1;
  padding: 10px 20px;
  margin-bottom: 9px;
  color: #abadb6;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 #00000007;
`;

const NftLink = styled.a`
  cursor: pointer;
`;

function GridCellC({ nft, account }: { nft: NFT, account: Account }) {
  return (
    <NftLink target="_blank" href={nft.permalink} rel="noreferrer">
      <img style={{ width: "100%" }} src={nft.image} />
    </NftLink>
  );
}
const GridCell = React.memo(GridCellC);

function ListCellC({ nft, account }: { nft: NFT, account: Account }) {
  return (
    <Box grow horizontal p={2} mb={2} bg="palette.background.paper" alignItems="center">
      <Box pl={2} width="14%">
        <NftLink target="_blank" href={nft.permalink} rel="noreferrer">
          <img style={{ width: 72, height: 72, objectFit: "contain" }} src={nft.image} />
        </NftLink>
      </Box>
      <Box width="40%" vertical>
        <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
          <Ellipsis>{nft.creator?.name || ""}</Ellipsis>
        </Text>
        <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
          <Ellipsis>{nft.name}</Ellipsis>
        </Text>
      </Box>
      <Box width="20%" vertical>
        <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
          <Ellipsis>{nft.collection?.name || nft.platform?.name || ""}</Ellipsis>
        </Text>
        <Box horizontal>
          <CryptoCurrencyIcon currency={account.currency} size={16} />
          <Box pl={1} flex="0 1 auto">
            <Ellipsis color="palette.text.shade100" ff="Inter|SemiBold" fontSize={4}>
              {getAccountName(account)}
            </Ellipsis>
          </Box>
        </Box>
      </Box>
      {nft.lastSale ? (
        <Box>
          <FormattedVal
            color="palette.text.shade100"
            fontSize={3}
            showCode
            unit={nft.lastSale.currency.units[0]}
            val={nft.lastSale.value}
          />
          <CounterValue
            color="palette.text.shade60"
            fontSize={3}
            currency={nft.lastSale.currency}
            value={nft.lastSale.value}
          />
        </Box>
      ) : null}
      <Box px={2} grow alignItems="flex-end">
        <Button disabled={!canSendNFT(nft)} outline>
          <Box horizontal flow={1} alignItems="center">
            <IconSend size={14} /> <Box>Send</Box>
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
const ListCell = React.memo(ListCellC);

function useCollections(nfts) {
  const [filterByCollectionSlug, setFilterByCollectionSlug] = useState(null);
  const collectionItems = useMemo(() => {
    const items = [{ label: "All collections", key: "" }];
    const seen = {};
    nfts.forEach(({ nft }) => {
      const { collection } = nft;
      if (!collection) return;
      seen[collection.slug] = (seen[collection.slug] || 0) + 1;
      if (seen[collection.slug] !== 2) return; // when we have at least 2 items, we will add to list
      items.push({
        key: collection.slug,
        label: collection.name,
      });
    });
    items.sort((a, b) => {
      const diff = seen[b.key] - seen[a.key];
      if (diff) return diff;
      return a.label.localeCompare(b.label);
    });
    return items;
  }, [nfts]);
  return { collectionItems, filterByCollectionSlug, setFilterByCollectionSlug };
}

function GridMode({ list }: { list: * }) {
  const cols = [[], [], []];
  for (let i = 0; i < list.length; i++) {
    cols[i % 3].push(list[i]);
  }
  return (
    <Grid>
      {cols.map((list, i) => (
        <Column key={i}>
          {list.map(({ nft, account }) => (
            <GridCell key={nft.id} nft={nft} account={account} />
          ))}
        </Column>
      ))}
    </Grid>
  );
}

function NftList({ nfts }: { nfts: Array<*> }) {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("newest");
  const [mode, setViewMode] = useState("list");
  const onTextChange = useCallback((evt: SyntheticInputEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  }, []);

  const filterByAccountId = null;
  const filterByPlatformId = null;

  const { collectionItems, filterByCollectionSlug, setFilterByCollectionSlug } = useCollections(
    nfts,
  );

  const list = useSortFilterNFTs(nfts, {
    sortBy: order,
    searchQuery: search,
    filterByAccountId,
    filterByCurrencyId: null,
    filterByPlatformId,
    filterByCollectionSlug,
  });

  return (
    <>
      <GenericBox horizontal p={0} alignItems="center">
        <SearchBox
          id={"accounts-search-input"}
          autoFocus
          onTextChange={onTextChange}
          search={search}
        />
        <CollectionSort
          collectionItems={collectionItems}
          onChange={setFilterByCollectionSlug}
          value={filterByCollectionSlug || ""}
        />
        <Box ml={4} mr={4}>
          <Order order={order} setOrder={setOrder} />
        </Box>
        <ToggleButton
          event="Account view table"
          id="accounts-display-list"
          mr={1}
          onClick={() => setViewMode("list")}
          active={mode === "list"}
        >
          <ListIcon />
        </ToggleButton>
        <ToggleButton
          event="Account view mosaic"
          id="accounts-display-grid"
          onClick={() => setViewMode("card")}
          active={mode === "card"}
        >
          <GridIcon />
        </ToggleButton>
      </GenericBox>

      {list.length ? (
        mode === "list" ? (
          <List>
            {list.map(({ nft, account }) => (
              <ListCell key={nft.id} nft={nft} account={account} />
            ))}
          </List>
        ) : (
          <GridMode list={list} />
        )
      ) : (
        "No results"
      )}
    </>
  );
}

export default NftList;
