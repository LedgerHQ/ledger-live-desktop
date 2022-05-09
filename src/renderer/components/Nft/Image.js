// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { NFTMetadata, NFTMediaSizes } from "@ledgerhq/live-common/lib/types";
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
const Wrapper: ThemedComponent<{
  full?: boolean,
  size?: number,
  loaded: boolean,
  square: boolean,
  maxHeight?: number,
  maxWidth?: number,
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down",
}> = styled.div`
  width: ${({ full, size }) => (full ? "100%" : `${size}px`)};
  height: ${({ full }) => full && "100%"};
  aspect-ratio: ${({ square }) => (square ? "1 / 1" : "initial")};
  max-width: ${({ maxWidth }) => maxWidth && `${maxWidth}px`};
  max-height: ${({ maxHeight }) => maxHeight && `${maxHeight}px`};
  border-radius: 4px;
  overflow: hidden;
  background-size: contain;

  display: flex;
  align-items: center;
  justify-content: center;

  & > *:nth-child(1) {
    display: ${({ loaded, error }) => (loaded || error ? "none" : "block")};
  }

  & > img {
    display: ${({ loaded, error }) => (loaded || error ? "block" : "none")};
    ${({ objectFit }) =>
      objectFit === "cover"
        ? `width: 100%;
         height: 100%;`
        : `max-width: 100%;
        max-height: 100%;`}
    object-fit: ${p => p.objectFit ?? "cover"};
    border-radius: 4px;
    user-select: none;
  }
`;

// TODO Figure out if we really need this once we know who creates/processes the media.
const Gen = styled.div`
  --hue: ${p => (p?.tokenId || "abcdefg").substr(-8) % 360};
  background-image: url(${Fallback});
  background-size: contain;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: hsla(var(--hue), 55%, 66%, 1);
  background-blend-mode: hard-light;
  aspect-ratio: 1;

  &:after {
    display: ${p => (p.full ? "flex" : "none")}
    content: "${p => p?.metadata?.nftName || centerEllipsis(p?.tokenId || "-")}";
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
  metadata: NFTMetadata,
  tokenId: string,
  mediaFormat?: NFTMediaSizes,
  full?: boolean,
  size?: number,
  maxHeight?: number,
  maxWidth?: number,
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down",
  square?: boolean,
  onClick?: (e: Event) => void,
  setUseFallback: boolean => void,
  isFallback: boolean,
};

type State = {
  loaded: boolean,
  error: boolean,
};

class Image extends React.PureComponent<Props, State> {
  static defaultProps = {
    full: false,
    size: 32,
    mediaFormat: "preview",
  };

  state = {
    loaded: false,
    error: false,
  };

  render() {
    const {
      full,
      mediaFormat = "preview",
      size,
      metadata,
      tokenId,
      maxHeight,
      onClick,
      square = true,
      objectFit = "cover",
      setUseFallback,
      isFallback,
    } = this.props;
    const { loaded, error } = this.state;
    const { uri } = metadata?.medias?.[isFallback ? "preview" : mediaFormat] || {};

    return (
      <Wrapper
        full={full}
        size={size}
        loaded={loaded}
        error={error || !uri}
        square={square}
        maxHeight={maxHeight}
        objectFit={objectFit}
      >
        <Skeleton full />
        {(uri && !error) || isFallback ? (
          <img
            onClick={onClick}
            onLoad={() => this.setState({ loaded: true })}
            onError={() => {
              this.setState({ error: true });
              setUseFallback(true);
            }}
            src={uri}
          />
        ) : (
          <Gen tokenId={tokenId} metadata={metadata} />
        )}
      </Wrapper>
    );
  }
}

export default Image;
