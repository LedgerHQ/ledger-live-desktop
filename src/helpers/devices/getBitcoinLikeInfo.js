// @flow

import type Transport from '@ledgerhq/hw-transport'

const getBitcoinLikeInfo = (
  transport: Transport<any>,
): Promise<{
  P2PKH: number,
  P2SH: number,
  message: Buffer,
  short: Buffer,
}> =>
  transport.send(0xe0, 0x16, 0x00, 0x00).then(res => {
    const P2PKH = res.readUInt16BE(0)
    const P2SH = res.readUInt16BE(2)
    const message = res.slice(5, res.readUInt8(4))
    const short = res.slice(5 + message.length + 1, res.readUInt8(5 + message.length))
    return { P2PKH, P2SH, message, short }
  })

export default getBitcoinLikeInfo
