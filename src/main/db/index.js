// @flow

import { log } from "@ledgerhq/logs";
import path from "path";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { NoDBPathGiven, DBWrongPassword } from "@ledgerhq/errors";
import {} from "@ledgerhq/live-common/lib/promise";
import { encryptData, decryptData } from "~/main/db/crypto";
import { readFile, writeFile } from "~/main/db/fsHelper";

import logger from "~/logger";
import { fsUnlink } from "~/helpers/fs";

const debounce = (fn: any => any, ms: number) => {
  let timeout;
  let resolveRefs = [];
  let rejectRefs = [];
  return (...args: any) => {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      resolveRefs.push(resolve);
      rejectRefs.push(reject);
    });
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(async () => {
      try {
        const res = await fn(...args);
        resolveRefs.forEach(r => r(res));
      } catch (err) {
        rejectRefs.forEach(r => r(err));
      }
      resolveRefs = [];
      rejectRefs = [];
    }, ms);
    return promise;
  };
};

type Transform = {
  get: any => any,
  set: any => any,
};

let DBPath = null;
let memoryNamespaces = {};
let encryptionKeys = {};
let transforms = {};

const DEBOUNCE_MS = process.env.NODE_ENV === "test" ? 1 : 500;
const save = debounce(saveToDisk, DEBOUNCE_MS);

/**
 * Reset memory state, db path, encryption keys, transforms..
 */
function init(_DBPath: string) {
  DBPath = _DBPath;
  memoryNamespaces = {};
  encryptionKeys = {};
  transforms = {};
}

/**
 * Register a transformation for a given namespace and keyPath
 * it will be used when reading/writing from/to file
 */
function registerTransform(ns: string, keyPath: string, transform: Transform) {
  if (!transforms[ns]) transforms[ns] = {};
  transforms[ns][keyPath] = transform;
}

/**
 * Load a namespace, using <file>.json
 */
async function load(ns: string): Promise<mixed> {
  try {
    if (!DBPath) throw new NoDBPathGiven();
    const filePath = path.resolve(DBPath, `${ns}.json`);
    const fileContent = await readFile(filePath);
    const { data } = JSON.parse(fileContent.toString());
    memoryNamespaces[ns] = data;

    // transform fields
    for (const keyPath in transforms[ns]) {
      if (transforms[ns].hasOwnProperty(keyPath)) {
        const transform = transforms[ns][keyPath];
        const val = get(memoryNamespaces[ns], keyPath);

        // if value is string, it's encrypted, so we don't want to transform
        if (typeof val === "string") continue; // eslint-disable-line no-continue

        set(memoryNamespaces[ns], keyPath, transform.get(val));
      }
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      memoryNamespaces[ns] = {};
      await save(ns);
    } else {
      logger.error(err);
      throw err;
    }
  }
  return memoryNamespaces[ns];
}

async function ensureNSLoaded(ns: string) {
  if (!memoryNamespaces[ns]) {
    await load(ns);
  }
}

/**
 * In the event of a user refreshing the app we need to reload the data
 * to ensure the lock/unlock detection is still valid.
 */
async function reload() {
  DBPath && init(DBPath);
}

/**
 * Register a keyPath in db that is encrypted
 * This will decrypt the keyPath at this moment, and will be used
 * in `save` to encrypt it back
 */
async function setEncryptionKey(ns: string, keyPath: string, encryptionKey: string): Promise<any> {
  if (!encryptionKeys[ns]) encryptionKeys[ns] = {};
  encryptionKeys[ns][keyPath] = encryptionKey;
  const val = await getKey(ns, keyPath, null);

  // no need to decode if already decoded
  if (!val || typeof val !== "string") {
    return save(ns);
  }

  try {
    let decrypted = JSON.parse(decryptData(val, encryptionKey));

    // handle the case when we just migrated from the previous storage
    // which stored the data in binary with a `data` key
    if (ns === "app" && keyPath === "accounts" && decrypted.data) {
      decrypted = decrypted.data;
    }

    // apply transform if needed
    const transform = get(transforms, `${ns}.${keyPath}`);
    if (transform) {
      decrypted = transform.get(decrypted);
    }

    // only set decrypted data in memory
    set(memoryNamespaces[ns], keyPath, decrypted);

    return save(ns);
  } catch (err) {
    log("db", "setEncryptionKey failure: " + String(err));
    logger.error(err);
    throw new DBWrongPassword();
  }
}

async function removeEncryptionKey(ns: string, keyPath: string) {
  set(encryptionKeys, `${ns}.${keyPath}`, undefined);
  return save(ns);
}

/**
 * Set a key in the given namespace
 */
async function setKey(ns: string, keyPath: string, value: any): Promise<any> {
  logger.onDB("write", `${ns}:${keyPath}`);
  await ensureNSLoaded(ns);
  set(memoryNamespaces[ns], keyPath, value);
  return save(ns);
}

/**
 * Get a key in the given namespace
 */
async function getKey(ns: string, keyPath: string, defaultValue?: any): Promise<any> {
  logger.onDB("read", `${ns}:${keyPath}`);
  await ensureNSLoaded(ns);
  if (!keyPath) return memoryNamespaces[ns] || defaultValue;
  return get(memoryNamespaces[ns], keyPath, defaultValue);
}

/**
 * Get whole namespace
 */
async function getNamespace(ns: string, defaultValue?: any) {
  logger.onDB("read", ns);
  await ensureNSLoaded(ns);
  return memoryNamespaces[ns] || defaultValue;
}

async function setNamespace(ns: string, value: any) {
  logger.onDB("write", ns);
  set(memoryNamespaces, ns, value);
  return save(ns);
}

/**
 * Check if a key has been decrypted
 *
 * /!\ it consider encrypted if it's string and can't JSON.parse, so
 *     can brings false-positive if bad used
 */
async function hasBeenDecrypted(ns: string, keyPath: string): Promise<boolean> {
  const v = await getKey(ns, keyPath);
  if (typeof v !== "string") return true;
  try {
    JSON.parse(v);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Save given namespace to corresponding file, in atomic way
 */
async function saveToDisk(ns: string) {
  if (!DBPath) throw new NoDBPathGiven();
  await ensureNSLoaded(ns);

  // cloning because we are mutating the obj
  const clone = cloneDeep(memoryNamespaces[ns]);

  // transform fields
  if (transforms[ns]) {
    for (const keyPath in transforms[ns]) {
      if (transforms[ns].hasOwnProperty(keyPath)) {
        const transform = transforms[ns][keyPath];
        const val = get(clone, keyPath);
        // we don't want to transform encrypted fields (that have not being decrypted yet)
        if (!val || typeof val === "string") continue; // eslint-disable-line no-continue
        set(clone, keyPath, transform.set(val));
      }
    }
  }

  // encrypt fields
  if (encryptionKeys[ns]) {
    for (const keyPath in encryptionKeys[ns]) {
      if (encryptionKeys[ns].hasOwnProperty(keyPath)) {
        const encryptionKey = encryptionKeys[ns][keyPath];
        if (!encryptionKey) continue; // eslint-disable-line no-continue
        const val = get(clone, keyPath);
        if (!val) continue; // eslint-disable-line no-continue
        // eslint-disable-next-line node/no-deprecated-api
        const encrypted = encryptData(JSON.stringify(val), encryptionKey);
        set(clone, keyPath, encrypted);
      }
    }
  }

  const fileContent = JSON.stringify({ data: clone });
  await writeFile(path.resolve(DBPath, `${ns}.json`), fileContent);
}

async function cleanCache() {
  logger.onDB("clean cache");
  await setKey("app", "countervalues", null);
  await save("app");
}

async function resetAll() {
  logger.onDB("reset all");
  if (!DBPath) throw new NoDBPathGiven();
  memoryNamespaces.app = null;
  await fsUnlink(path.resolve(DBPath, "app.json"));
}

function isEncryptionKeyCorrect(ns: string, keyPath: string, encryptionKey: string) {
  try {
    return encryptionKeys[ns][keyPath] === encryptionKey;
  } catch (err) {
    return false;
  }
}

function hasEncryptionKey(ns: string, keyPath: string) {
  try {
    return !!encryptionKeys[ns][keyPath];
  } catch (err) {
    return false;
  }
}

function getDBPath() {
  if (!DBPath) throw new Error("Trying to get db path but it is not initialized");
  return DBPath;
}

export default {
  init,
  reload,
  load,
  registerTransform,
  setEncryptionKey,
  removeEncryptionKey,
  isEncryptionKeyCorrect,
  hasEncryptionKey,
  setKey,
  getKey,
  getNamespace,
  setNamespace,
  hasBeenDecrypted,
  save,
  cleanCache,
  resetAll,
  getDBPath,
};
