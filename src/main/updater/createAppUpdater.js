// @flow

import { UpdateIncorrectHash, UpdateIncorrectSig } from "@ledgerhq/errors";
import * as sslHelper from "./sslHelper";

type Opts = {
  filename: string,
  computeHash: () => Promise<string>,
  getNextKey: (?string) => Promise<string>,
  getNextKeySignature: string => Promise<Buffer>,
  getHashFile: () => Promise<string>,
  getHashFileSignature: () => Promise<Buffer>,
};

export default function createAppUpdater(opts: Opts): { verify: () => Promise<void> } {
  const {
    filename,
    computeHash,
    getNextKey,
    getNextKeySignature,
    getHashFile,
    getHashFileSignature,
  } = opts;

  // main logic:
  // - fetch hashFile + its signature
  // - verify signature
  // - compare hash with update hash
  // throw if any step fail.
  async function verify() {
    const [hashFile, hashFileSignature, key] = await Promise.all([
      getHashFile(),
      getHashFileSignature(),
      getNextKey(),
    ]);
    await verifyHashFileSignature(hashFile, hashFileSignature, key);
    await compareHash(hashFile);
  }

  // compute the update hash and compare it to the hash located in hash file
  async function compareHash(hashFile) {
    const computedHash = await computeHash();
    const hashFromFile = extractHashFromHashFile(hashFile, filename);
    if (hashFromFile !== computedHash) {
      throw new UpdateIncorrectHash(computedHash);
    }
  }

  // verify hash signature with given pubkey
  // if it fails, try to get next key and repeat
  // if no more key, throw
  async function verifyHashFileSignature(hash, sigContent, pubKey) {
    try {
      await sslHelper.verify(hash, sigContent, pubKey);
    } catch (err) {
      try {
        const nextPubKey = await getNextPubKey(pubKey);
        await verifyHashFileSignature(hash, sigContent, nextPubKey);
      } catch (err) {
        throw new UpdateIncorrectSig();
      }
    }
  }

  // fetch the next pubkey based on the previous key fingerprint
  // also fetch signature, and verify against previous pubkey
  async function getNextPubKey(pubKey) {
    const fingerprint = await sslHelper.getFingerprint(pubKey);
    const nextPubKey = await getNextKey(fingerprint);
    const nextPubKeySignature = await getNextKeySignature(fingerprint);
    await sslHelper.verify(nextPubKey, nextPubKeySignature, pubKey);
    return nextPubKey;
  }

  return {
    verify,
  };
}

// a hash file looks like: "<hash>  <filename>\n<hash>  <filename>"
// we only need the hash for the given filename
function extractHashFromHashFile(hashFile, filename) {
  let hash;
  hashFile.split("\n").find(r => {
    const row = r.split(/\s+/);
    hash = row[1] === filename ? row[0] : "";
    return !!hash;
  });
  return hash;
}
