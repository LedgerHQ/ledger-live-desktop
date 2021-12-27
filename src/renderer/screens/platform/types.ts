import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

export type SectionBaseProps = {
  manifests: AppManifest[];
  handleClick: (manifest: AppManifest) => any;
};
