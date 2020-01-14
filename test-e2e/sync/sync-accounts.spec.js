const pick = require('lodash/pick')

const ACCOUNTS_FIELDS = [
  'archived',
  'freshAddress',
  'freshAddressPath',
  'id',
  'index',
  'isSegwit',
  'name',
  'path',
  'xpub',
  'operations',
  'currencyId',
  'unitMagnitude',
  'balance',
]

const OPS_FIELDS = ['id', 'hash', 'accountId', 'type', 'senders', 'recipients', 'value', 'fee']

const OP_SORT = (a, b) => {
  const aHash = getOpHash(a)
  const bHash = getOpHash(b)
  if (aHash < bHash) return -1
  if (aHash > bHash) return 1
  return 0
}

const ACCOUNT_SORT = (a, b) => {
  const aHash = getAccountHash(a)
  const bHash = getAccountHash(b)
  if (aHash < bHash) return -1
  if (aHash > bHash) return 1
  return 0
}

describe('sync accounts', () => {
  test('should give the same app.json', () => {
    const expected = getSanitized('./data/expected-app.json')
    const actual = getSanitized('./data/actual-app.json')
    expect(actual).toEqual(expected)
  })
})

function getSanitized(filePath) {
  const data = require(`${filePath}`) // eslint-disable-line import/no-dynamic-require
  const accounts = data.data.accounts.map(a => a.data)
  accounts.sort(ACCOUNT_SORT)
  return accounts
    .map(a => pick(a, ACCOUNTS_FIELDS))
    .map(a => {
      a.operations.sort(OP_SORT)
      return {
        ...a,
        operations: a.operations.map(o => pick(o, OPS_FIELDS)),
      }
    })
}

function getOpHash(op) {
  return `${op.accountId}--${op.hash}--${op.type}`
}

function getAccountHash(account) {
  return `${account.name}`
}
