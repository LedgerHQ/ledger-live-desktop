import { readFile } from "fs";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/index";

export default UploadDummyApp = filePath => {
  const addLocalManifest = usePlatformApp();

  readFile(filePath, (readError, data) => {
    if (!readError) {
      try {
        const manifest = JSON.parse(data.toString());
        console.log(manifest);
        Array.isArray(manifest)
          ? manifest.forEach(m => addLocalManifest(m))
          : addLocalManifest(manifest);
      } catch (parseError) {
        console.log(parseError);
      }
    }
  });
};
