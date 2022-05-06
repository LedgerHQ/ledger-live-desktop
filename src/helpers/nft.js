// @flow
import type { NFTMetadata, NFTMediaSizes } from "@ledgerhq/live-common/lib/types";

const mimeTypesMap = {
  video: ["video/mp4", "video/webm", "video/ogg"],
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};
const mimeTypesCategories = Object.keys(mimeTypesMap);

export const getMetadataMediaType = (
  metadata: NFTMetadata,
  mediaFormat: NFTMediaSizes = "preview",
): $Keys<typeof mimeTypesMap> | void => {
  const { mediaType } = metadata?.medias?.[mediaFormat] || {};
  return mimeTypesCategories.find(type => mimeTypesMap[type].includes(mediaType));
};
