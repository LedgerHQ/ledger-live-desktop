// @flow

import createAppUpdater from "./createAppUpdater";

export default ({
  filename,
  computedHash,
  hashFile,
  signature,
  pubKey,
  pubKeys,
}: {
  filename: string,
  computedHash: string,
  hashFile: string,
  signature: Buffer,
  pubKey: string,
  pubKeys: Array<{ fingerprint: string, content: string, signature: Buffer }>,
}) =>
  createAppUpdater({
    filename,
    computeHash: () => Promise.resolve(computedHash),
    getHashFile: () => Promise.resolve(hashFile),
    getHashFileSignature: () => Promise.resolve(signature),
    getNextKey: async (fingerprint: ?string) => {
      if (!fingerprint) return Promise.resolve(pubKey);
      const key = pubKeys.find(k => k.fingerprint === fingerprint);
      if (!key) {
        throw new Error(`Cannot find key for fingerprint ${fingerprint}`);
      }
      return key.content;
    },
    getNextKeySignature: async (fingerprint: string) => {
      const key = pubKeys.find(k => k.fingerprint === fingerprint);
      if (!key) {
        throw new Error(`Cannot find signature for key ${fingerprint}`);
      }
      return key.signature;
    },
  });
