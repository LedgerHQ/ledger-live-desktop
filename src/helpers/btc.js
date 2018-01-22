export function computeTransaction(addresses) {
  return transaction => {
    const outputVal = transaction.outputs
      .filter(o => addresses.includes(o.address))
      .reduce((acc, cur) => acc + cur.value, 0)
    const inputVal = transaction.inputs
      .filter(i => addresses.includes(i.address))
      .reduce((acc, cur) => acc + cur.value, 0)
    const balance = outputVal - inputVal
    return {
      ...transaction,
      balance,
    }
  }
}
