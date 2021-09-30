// @flow
import React, { useState } from "react";
import styled from "styled-components";
import BigSpinner from "~/renderer/components/BigSpinner";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { NFTWithMetadata } from "@ledgerhq/live-common/lib/types";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Fallback from "~/renderer/images/nftFallback.jpg";

type Props = {
  nft: NFTWithMetadata,
  fill?: boolean,
  size?: number,
};

/**
 * Nb: This image component can be used for small listings, large gallery rendering,
 * and even tokens without an image where it will fallback to a generative image
 * based on the token metadata and some hue changes.
 *
 * The text in the fallback image is only visible if we are in `fill` mode, since list
 * mode is not large enough for the text to be readable.
 */
const Wrapper: ThemedComponent<{ fill?: boolean, size?: number, isLoading: boolean }> = styled.div`
  width: ${({ fill, size = 32 }) => (fill ? "100%" : `${size}px`)};
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  background: ${p => p.theme.colors.palette.text.shade5};
  background-size: contain;

  display: flex;
  align-items: center;
  justify-content: center;

  & > *:nth-child(1) {
    display: ${p => (p.isLoading ? "block" : "none")};
  }

  & > img {
    display: ${p => (p.isLoading ? "none" : "block")};
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const Gen = styled.div`
  --hue: ${p => p.nft.tokenId.substr(-8) % 360};
  background-image: url(${Fallback});
  background-size: contain;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: hsla(var(--hue), 55%, 66%, 1);
  background-blend-mode: hard-light;

  &:after {
    display: ${p => (p.fill ? "flex" : "none")}
    content: "${p => p.nft.nftName || centerEllipsis(p.nft.tokenId)}";
    font-size: 16px;
    font-size: 1vw;
    color: #fff;
    padding: 0.1vh;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: "Inter", Arial;
    font-weight: 600;
    width: 100%;
    height: 100%;
  }
`;

const Image = ({ fill, nft, size }: Props) => {
  const [isLoading, setLoading] = useState(!!nft.picture); // Only attempt to load if we have a url

  return (
    <Wrapper fill={fill} size={size} isLoading={isLoading}>
      <BigSpinner size={fill ? 50 : 16} color="palette.text.shade50" />
      {nft.picture ? <img onLoad={() => setLoading(false)} src={nft.picture} /> : <Gen nft={nft} />}
    </Wrapper>
  );
};

export default Image;
