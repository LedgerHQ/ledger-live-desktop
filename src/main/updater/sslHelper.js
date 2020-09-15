// @flow
import crypto from "crypto";
import secp256k1 from "secp256k1";
import keyto from "@trust/keyto";
import { UpdateIncorrectSig } from "@ledgerhq/errors";

export async function getFingerprint(pubKey: string) {
  const hash = crypto.createHash("sha256");

  hash.update(pubKey);

  const result = hash.digest("hex");

  return result;
}

export async function verify(msgContent: string, sigContent: Buffer, pubKeyContent: string) {
  try {
    // Since Electron replaced OpenSSL with BoringSSL, we lost native support for secp256k1 curve
    // We instead rely on bitcoin-core secp256k1 lib which expects values in slightly different format

    // Let's hash the content to be verified
    const hash = crypto.createHash("sha256");
    hash.update(msgContent);
    const message = hash.digest();

    // Convert signature for secp256k1 lib compat
    const signature = secp256k1.signatureNormalize(secp256k1.signatureImport(sigContent));

    // Convert public key
    // Parse pem key to JWK
    const jwk = keyto.from(pubKeyContent, "pem");
    // Transform parsed key to Bitcoin format
    const blk = jwk.toString("blk", "public");
    // Convert string to Buffer
    const publicKey = Buffer.from(blk, "hex");

    const verified = secp256k1.ecdsaVerify(signature, message, publicKey);

    if (!verified) {
      throw new UpdateIncorrectSig();
    }
  } catch (e) {
    throw new UpdateIncorrectSig();
  }
}

export async function sign(msgContent: string, privKeyContent: string) {
  const sign = crypto.createSign("sha256");
  sign.update(msgContent);
  const signature = sign.sign(privKeyContent);

  return signature;
}
