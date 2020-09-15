// @flow

import { log } from "@ledgerhq/logs";
import crypto from "crypto";

// /!\ changing those presets would lock out users with already encrypted databases due to breaking changes.
const ENCRYPTION_ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
const PBKDF2_ITERATIONS = 10000;
const PBKDF2_KEY_LENGTH = 32;
const PBKDF2_DIGEST = "sha512";

export const encryptData = (data: string, encryptionKey: string) => {
  // in any case, we save new data using an initialization vector
  const initializationVector = crypto.randomBytes(IV_LENGTH);
  const password = crypto.pbkdf2Sync(
    encryptionKey,
    initializationVector.toString(),
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LENGTH,
    PBKDF2_DIGEST,
  );
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, password, initializationVector);
  return Buffer.concat([
    initializationVector,
    Buffer.from(":"),
    cipher.update(data, "utf8"),
    cipher.final(),
  ]).toString("base64");
};

export const decryptData = (raw: string, encryptionKey: string) => {
  const data = Buffer.from(raw, "base64");
  log("db/crypto", "decryptData. full data length = " + data.length);

  // We check if the data include an initialization vector
  if (data.slice(IV_LENGTH, IV_LENGTH + 1).toString() === ":") {
    const initializationVector = data.slice(0, IV_LENGTH);
    const password = crypto.pbkdf2Sync(
      encryptionKey,
      initializationVector.toString(),
      PBKDF2_ITERATIONS,
      PBKDF2_KEY_LENGTH,
      PBKDF2_DIGEST,
    );
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, password, initializationVector);
    return Buffer.concat([decipher.update(data.slice(IV_LENGTH + 1)), decipher.final()]).toString(
      "utf8",
    );
  }

  log("db/crypto", "fallback to deprecated API");

  // if not, then we fallback to the deprecated API
  // eslint-disable-next-line node/no-deprecated-api
  const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, encryptionKey);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
};
