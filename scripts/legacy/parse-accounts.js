//                Utility to human-read the accounts.json file
//           You have to pass it in parameter, because the location
//                        differ depending on the OS.

const {
  formatCurrencyUnit,
  getCryptoCurrencyById,
} = require('@ledgerhq/live-common/lib/helpers/currencies')
const chalk = require('chalk')
const padStart = require('lodash/padStart')
const padEnd = require('lodash/padEnd')

const { argv } = process

const [, , FILE_PATH] = argv

if (!FILE_PATH) {
  console.log(`You need to specify a file`)
  process.exit(1)
}

const { data: wrappedAccounts } = require(FILE_PATH) // eslint-disable-line

const str = wrappedAccounts
  .map(({ data: account }) => {
    const currency = getCryptoCurrencyById(account.currencyId)
    const unit = currency.units[0]
    const headline = `${account.isSegwit ? '[SEGWIT]' : '[NOT SEGWIT]'} ${account.name} | ${
      account.id
    } | ${account.path} | balance: ${formatCurrencyUnit(unit, account.balance, {
      showCode: true,
      alwaysShowSign: true,
    })}`
    return [
      headline,
      headline
        .split('')
        .map(() => '-')
        .join(''),
      account.operations
        .map(op => {
          const opType = op.amount < 0 ? 'SEND' : 'RECEIVE'
          return [
            padEnd(opType, 8),
            op.date.substr(0, 10),
            chalk[opType === 'SEND' ? 'red' : 'green'](
              padStart(
                formatCurrencyUnit(unit, op.amount, {
                  showCode: true,
                  alwaysShowSign: true,
                }),
                15,
              ),
            ),
            op.hash,
          ].join(' ')
        })
        .join('\n'),
    ].join('\n')
  })
  .join('\n\n')

console.log(str)
