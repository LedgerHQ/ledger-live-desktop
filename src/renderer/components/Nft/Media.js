// @flow
import React, { useMemo, useState, memo } from "react";
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

const Media = ({
  mediaFormat,
  metadata,
  tokenId,
  full,
  size,
  maxHeight,
  maxWidth,
  objectFit,
  square,
  onClick,
}: Props) => {
  const contentType = useMemo(() => getMetadataMediaType(metadata, mediaFormat), [
    metadata,
    mediaFormat,
  ]);
  const [useFallback, setUseFallback] = useState(false);
  const Component = useMemo(() => (contentType === "video" && !useFallback ? Video : Image), [
    contentType,
    useFallback,
  ]);

  const squareWithDefault = (() => {
    if (typeof square !== "undefined") {
      return square;
    }

    return contentType !== "video";
  })();

  console.log({ useFallback, contentType, mediaFormat });

  return (
    <Component
      mediaFormat={mediaFormat}
      metadata={metadata}
      tokenId={tokenId}
      full={full}
      size={size}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      onClick={onClick}
      square={squareWithDefault}
      objectFit={objectFit}
      setUseFallback={setUseFallback}
      isFallback={useFallback}
    />
  );
};

export default memo<Props>(Media);
