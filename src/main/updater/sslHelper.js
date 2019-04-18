// @flow
import crypto from 'crypto'

export async function getFingerprint(pubKey: string) {
  const hash = crypto.createHash('sha256')

  hash.update(pubKey)

  const result = hash.digest('hex')

  return result
}

export async function verify(msgContent: string, sigContent: Buffer, pubKeyContent: string) {
  if (!sigContent) {
    throw new Error('No signature found')
  }

  const verify = crypto.createVerify('sha256')
  verify.update(msgContent)
  const verified = verify.verify(pubKeyContent, sigContent)

  if (!verified) {
    throw new Error('Signature check failed')
  }
}

export async function sign(msgContent: string, privKeyContent: string) {
  const sign = crypto.createSign('sha256')
  sign.update(msgContent)
  const signature = sign.sign(privKeyContent)

  return signature
}
