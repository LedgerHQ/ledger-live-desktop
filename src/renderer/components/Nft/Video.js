// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { NFTMetadata, NFTMediaSizes } from "@ledgerhq/live-common/lib/types";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Fallback from "~/renderer/images/nftFallback.jpg";
import Skeleton from "./Skeleton";

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
  aspect-ratio: ${({ square, error }) => (square || error ? "1 / 1" : "initial")};
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

  & > video {
    display: ${({ loaded, error }) => (loaded || error ? "block" : "none")};
    ${({ objectFit }) =>
      objectFit === "cover"
        ? `width: 100%;
         height: 100%;`
        : `max-width: 100%;
        max-height: 100%;`}
    object-fit: ${p => p.objectFit ?? "contain"};
    border-radius: 4px;
    user-select: none;
    position: relative;
    z-index: 10;
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
};

type State = {
  loaded: boolean,
  error: boolean,
};

class Video extends React.PureComponent<Props, State> {
  static defaultProps = {
    full: false,
    size: 32,
  };

  state = {
    loaded: false,
    error: false,
  };

  render() {
    const {
      mediaFormat = "big",
      metadata,
      tokenId,
      full,
      size,
      maxHeight,
      square = true,
      objectFit = "contain",
    } = this.props;
    const { loaded, error } = this.state;
    const { uri, mediaType } = metadata?.medias?.[mediaFormat] || {};

    if (!uri) {
      this.setState({ error: true });
    }

    return (
      <Wrapper
        full={full}
        size={size}
        loaded={loaded}
        error={error}
        square={square}
        maxHeight={maxHeight}
        objectFit={objectFit}
      >
        <Skeleton full />
        {uri && !error ? (
          <video
            onError={() => this.setState({ error: true })}
            onLoadedData={() => this.setState({ loaded: true })}
            autoPlay
            loop
            controls
          >
            <source src={uri} type={mediaType} />
          </video>
        ) : (
          <Gen tokenId={tokenId} metadata={metadata} />
        )}
      </Wrapper>
    );
  }
}

export default Video;
