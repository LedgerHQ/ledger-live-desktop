// @flow
import React from "react";
import type { NFTMetadata, NFTMediaSizes } from "@ledgerhq/live-common/lib/types";
import { getMetadataMediaType } from "~/helpers/nft";
import Image from "./Image";
import Video from "./Video";

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
};

type State = {
  useFallback: boolean,
};

class Media extends React.PureComponent<Props, State> {
  state = {
    useFallback: false,
  };

  setUseFallback = (_useFallback: boolean): void => {
    this.setState({ useFallback: _useFallback });
  };

  render() {
    const { mediaFormat, metadata, square } = this.props;
    const { useFallback } = this.state;

    const contentType = getMetadataMediaType(metadata, mediaFormat);
    const Component = contentType === "video" && !useFallback ? Video : Image;

    const squareWithDefault = (() => {
      if (typeof square !== "undefined") {
        return square;
      }

      return contentType !== "video";
    })();

    return (
      <Component
        {...this.props}
        square={squareWithDefault}
        isFallback={useFallback}
        setUseFallback={this.setUseFallback}
      />
    );
  }
}

export default Media;
