import { AppManifest, CatalogMetadata } from "@ledgerhq/live-common/lib/platform/types";

export type SectionBaseProps = {
  manifests: AppManifest[];
  catalogMetadata?: CatalogMetadata;
  handleClick: (manifest: AppManifest) => any;
};
