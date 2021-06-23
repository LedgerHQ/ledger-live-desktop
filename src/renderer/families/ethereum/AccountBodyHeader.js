// @flow
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openURL } from "~/renderer/linking";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Image from "~/renderer/components/Image";
import Box from "~/renderer/components/Box";
import Vote from "~/renderer/icons/Vote";

import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";

type Props = {
  account: AccountLike,
};

const Img = styled(Image)`
  backgroundcolor: ${p => p.backgroundColor};
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: contain;
  z-index: 0;
  transition: all 0.4s ease-out;
`;

const IdContainer = styled(Text).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 1,
  color: "palette.primary.contrastText",
}))`
  position: absolute;
  top: 5px;
  left: 5px;
  width: auto;
  background-color: ${p => p.theme.colors.palette.primary.main};
  padding: 5px 10px;
  z-index: 2;
`;

const NameContainer = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
  color: "palette.text.shade100",
}))`
  width: 100%;
  margin: 0 0 15px 0;
  padding: 5px 10px;
  opacity: 0;
  z-index: 2;
  transition: opacity 0.4s ease-out;
  text-overflow: ellipsis;
  background-color: ${p => p.theme.colors.palette.background.default};
`;

const DescContainer = styled(Text).attrs(() => ({
  ff: "Inter|Medium",
  fontSize: 2,
  color: "palette.text.shade80",
}))`
  width: 100%;
  padding: 5px 10px;
  opacity: 0;
  z-index: 2;
  transition: opacity 0.4s ease-out;
  text-overflow: ellipsis;
  background-color: ${p => p.theme.colors.palette.background.default};
`;

const Container = styled(Box).attrs(() => ({
  m: 1,
  vertical: true,
  p: 1,
  relative: true,
  flex: "1 0 250px",
  height: "250px",
}))`
  cursor: pointer;
  &:hover {
    ${NameContainer}, ${DescContainer} {
      opacity: 1;
    }
    ${Img} {
      filter: grayscale(0.8) blur(2px);
      transform: scale(0.95);
    }
  }
`;

const openSeaURl = `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&owner=0xd1b3976cd24333c68dc6746f891fc698da1c0a4a`;

const Nft = ({ account }: { account: Account }) => {
  const [assets, setAssets] = useState<*>([]);

  useEffect(() => {
    fetch(openSeaURl)
      .then(data => data.json())
      .then(d => setAssets(d.assets));
  }, []);

  return (
    <TableContainer mb={6}>
      <TableHeader title={"NFT [powered by opensea.io]"}>
        {assets.length > 0 ? (
          <Button
            small
            color="palette.primary.main"
            onClick={() => openURL("https://opensea.io/")}
            mr={2}
          >
            <Box horizontal flow={1} alignItems="center">
              <Vote size={12} />
              <Box>Manage my NFT</Box>
            </Box>
          </Button>
        ) : null}
      </TableHeader>
      <Box horizontal flex="1" style={{ flexWrap: "wrap", overflow: "hidden" }}>
        {assets?.length > 0
          ? assets.map(
              (
                { id, background_color: bg, image_url: imgUrl, name, description, permalink },
                index,
              ) => (
                <Container key={id} onClick={() => permalink && openURL(permalink)}>
                  <Img backgroundColor={bg} alt={name} resource={imgUrl} />
                  <IdContainer>{id}</IdContainer>
                  <Box flex="1" />
                  {name ? <NameContainer>{name}</NameContainer> : null}
                  {description ? <DescContainer>{description}</DescContainer> : null}
                </Container>
              ),
            )
          : null}
      </Box>
    </TableContainer>
  );
};

const NftEntry = ({ account }: Props) => {
  if (account.type !== "Account") return null;

  return <Nft account={account} />;
};

export default NftEntry;
