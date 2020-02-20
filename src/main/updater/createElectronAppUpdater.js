// @flow

import crypto from "crypto";
import path from "path";
import fs from "fs";
import { UpdateFetchFileFail } from "@ledgerhq/errors";

import network from "@ledgerhq/live-common/lib/network";
import { fsReadFile } from "~/helpers/fs";
import createAppUpdater from "./createAppUpdater";

import pubKey from "./ledger-pubkey";

export default async ({ feedURL, info }: { feedURL: string, info: Object }) => {
  const { version: updateVersion, path: filename, downloadedFile: filePath } = info;

  const hashFileURL = `${feedURL}/ledger-live-desktop-${updateVersion}.sha512sum`;
  const hashSigFileURL = `${feedURL}/ledger-live-desktop-${updateVersion}.sha512sum.sig`;
  const keysURL = `${feedURL}/pubkeys`;

  return createAppUpdater({
    filename,
    computeHash: () => sha512sumPath(filePath),
    getHashFile: () => getDistantFileContent(hashFileURL),
    getHashFileSignature: () => getDistantFileContent(hashSigFileURL, true),
    getNextKey: (fingerprint: ?string) =>
      fingerprint ? getDistantFileContent(`${keysURL}/${fingerprint}.pem`) : pubKey,
    getNextKeySignature: async (fingerprint: string) =>
      getDistantFileContent(`${keysURL}/${fingerprint}.pem.sig`, true),
  });
};

// read the electron-updater file. we basically only need the filename here,
// because the hash file contains hashes for all platforms (better to have
// only 1 file to sign lel)
export async function readUpdateInfos(updateFolder: string) {
  const updateInfoPath = path.resolve(updateFolder, "update-info.json");
  const updateInfoContent = await fsReadFile(updateInfoPath);
  return JSON.parse(updateInfoContent);
}

// compute hash for given path.
export function sha512sumPath(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const sum = crypto.createHash("sha512");
    const stream = fs.createReadStream(path);
    stream.on("data", data => sum.update(data));
    stream.on("end", () => resolve(sum.digest("hex")));
    stream.on("error", reject);
  });
}

async function getDistantFileContent(url: string, binary: boolean = false) {
  const query: Object = { method: "GET", url };

  if (binary) {
    query.responseType = "arraybuffer";
  }

  try {
    const res = await network(query);
    return res.data;
  } catch (err) {
    throw new UpdateFetchFileFail(url);
  }
}
