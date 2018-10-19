// @flow

import * as openpgp from 'openpgp'

export async function getFingerprint(pubKey: string) {
  const { keys } = await openpgp.key.readArmored(pubKey)
  if (!keys.length) {
    throw new Error('No key found in pubKey')
  }
  return keys[0].getFingerprint()
}

export async function verify(msgContent: string, sigContent: string, pubKeyContent: string) {
  const signature = await openpgp.signature.readArmored(sigContent)
  const message = openpgp.message.fromText(msgContent)
  const { keys: publicKeys } = await openpgp.key.readArmored(pubKeyContent)
  const pgpOpts = { message, publicKeys, signature }
  const verified = await openpgp.verify(pgpOpts)

  if (verified.signatures.length === 0) {
    throw new Error('No signature found')
  }

  if (!verified.signatures.every(sig => sig.valid)) {
    throw new Error('Signature check failed')
  }
}

export async function sign(msgContent: string, privKeyContent: string) {
  const privKey = (await openpgp.key.readArmored(privKeyContent)).keys[0]

  const options = {
    message: openpgp.cleartext.fromText(msgContent),
    privateKeys: [privKey],
    detached: true,
  }

  const signed = await openpgp.sign(options)
  return signed.signature
}
