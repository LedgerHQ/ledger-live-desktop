import blockexplorer from 'blockchain.info/blockexplorer'

const explorer = blockexplorer.usingNetwork(3)

function computeTransaction(address) {
  return transaction => {
    const outputVal = transaction.out
      .filter(o => o.addr === address)
      .reduce((acc, cur) => acc + cur.value, 0)
    const inputVal = transaction.inputs
      .filter(i => i.prev_out.addr === address)
      .reduce((acc, cur) => acc + cur.prev_out.value, 0)
    const balance = outputVal - inputVal
    return {
      ...transaction,
      balance,
    }
  }
}

export async function getAddressData(address) {
  const addressData = await explorer.getAddress(address)
  const unifiedData = {
    address,
    balance: addressData.final_balance,
    transactions: addressData.txs.map(computeTransaction(address)),
  }
  return unifiedData
}
