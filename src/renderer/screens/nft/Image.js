// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { NFTWithMetadata } from "@ledgerhq/live-common/lib/types";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Fallback from "~/renderer/images/nftFallback.jpg";
import Skeleton from "./Skeleton";

/**
 * Nb: This image component can be used for small listings, large gallery rendering,
 * and even tokens without an image where it will fallback to a generative image
 * based on the token metadata and some hue changes.
 *
 * The text in the fallback image is only visible if we are in `full` mode, since list
 * mode is not large enough for the text to be readable.
 */
const Wrapper: ThemedComponent<{ full?: boolean, size?: number, loaded: boolean }> = styled.div`
  width: ${({ full, size }) => (full ? "100%" : `${size}px`)};
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  background: ${p => p.theme.colors.palette.background.default};
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
    user-select: none;
    pointer-events: none;
  }
`;

// TODO Figure out if we really need this once we know who creates/processes the media.
const Gen = styled.div`
  --hue: ${p => (p?.nft?.tokenId || "abcdefg").substr(-8) % 360};
  background-image: url(${Fallback});
  background-size: contain;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: hsla(var(--hue), 55%, 66%, 1);
  background-blend-mode: hard-light;

  &:after {
    display: ${p => (p.full ? "flex" : "none")}
    content: "${p => p?.nft?.nftName || centerEllipsis(p?.nft?.tokenId || "-")}";
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

type Props = {
  nft: NFTWithMetadata,
  full?: boolean,
  size?: number,
};

type State = {
  loaded: boolean,
  error: boolean,
};

class Image extends React.PureComponent<Props, State> {
  static defaultProps = {
    full: false,
    size: 32,
  };

  state = {
    loaded: false,
    error: false,
  };

  render() {
    const { full, size, nft } = this.props;
    const { loaded, error } = this.state;

    return (
      <Wrapper full={full} size={size} loaded={loaded || error}>
        <Skeleton full />
        {nft?.media && !error ? (
          <img
            onLoad={() => this.setState({ loaded: true })}
            onError={() => this.setState({ error: true })}
            src={nft.media}
          />
        ) : (
          <Gen nft={nft} />
        )}
      </Wrapper>
    );
  }
}

export default Image;
