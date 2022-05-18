// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
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

type Props = {
  uri: string,
  mediaType: string,
  full?: boolean,
  size?: number,
  maxHeight?: number,
  maxWidth?: number,
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down",
  square?: boolean,
  setUseFallback: boolean => void,
};

type State = {
  loaded: boolean,
};

class Video extends React.PureComponent<Props, State> {
  static defaultProps = {
    full: false,
    size: 32,
  };

  state = {
    loaded: false,
  };

  render() {
    const {
      uri,
      mediaType,
      full,
      size,
      maxHeight,
      square = true,
      objectFit = "contain",
      setUseFallback,
    } = this.props;
    const { loaded } = this.state;

    return (
      <Wrapper
        full={full}
        size={size}
        loaded={loaded}
        square={square}
        maxHeight={maxHeight}
        objectFit={objectFit}
      >
        <Skeleton full />
        <video
          onError={() => {
            setUseFallback(true);
          }}
          onLoadedData={() => this.setState({ loaded: true })}
          autoPlay
          loop
          controls
          disablePictureInPicture
        >
          <source src={uri} type={mediaType} />
        </video>
      </Wrapper>
    );
  }
}

export default Video;
