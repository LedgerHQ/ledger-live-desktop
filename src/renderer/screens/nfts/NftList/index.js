// @flow
import React from "react";
import styled from "styled-components";
import type { Nft, Account } from "@ledgerhq/live-common/lib/types";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import CurrencyUnitValue from "~/renderer/components/CurrencyUnitValue";

const Container = styled.div``;

function Cell({ nft, account }: { nft: Nft, account: Account }) {
  return (
    <Box grow horizontal pb={2}>
      <Box>
        <a target="_blank" href={nft.permalink} rel="noreferrer">
          <img style={{ width: 200, height: 200, objectFit: "contain" }} src={nft.image} />
        </a>
      </Box>
      <Box grow p={2}>
        <Text fontWeight="bold">{nft.name}</Text>
        <p>{nft.description}</p>
        <p>Quantity: {nft.quantity} (NB: not sure if we display this)</p>
        {nft.lastSale ? (
          <Box>
            last price at{" "}
            <CurrencyUnitValue
              showCode
              unit={nft.lastSale.currency.units[0]}
              value={nft.lastSale.value}
            />
          </Box>
        ) : null}
        <Box horizontal>
          <Button primary>send</Button>
        </Box>
      </Box>
    </Box>
  );
}

function NftList({ nfts }: { nfts: Array<*> }) {
  return (
    <Container>
      {nfts.map(({ nft, account }) => (
        <Cell key={nft.id} nft={nft} account={account} />
      ))}
    </Container>
  );
}

export default NftList;
