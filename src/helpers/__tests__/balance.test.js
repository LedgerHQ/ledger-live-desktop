import { getBalanceHistoryForAccount, getBalanceHistoryForAccounts } from 'helpers/balance'

const counterValues = {
  'BTC-USD': {
    byDate: {
      '2018-01-01': 1000,
      '2018-01-02': 2000,
      '2018-01-03': 3000,
      '2018-01-04': 4000,
      '2018-01-05': 5000,
    },
  },
}

describe('helpers > balance', () => {
  describe('getBalanceHistoryForAccount', () => {
    test('should handle a simple case', () => {
      const account = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 100000000,
          '2018-01-02': 200000000,
        },
      }

      const interval = {
        start: '2018-01-01',
        end: '2018-01-02',
      }

      const balances = getBalanceHistoryForAccount({
        counterValue: 'USD',
        account,
        counterValues,
        interval,
      })

      expect(balances).toEqual([
        { date: '2018-01-01', balance: 1000 },
        { date: '2018-01-02', balance: 4000 },
      ])
    })

    test('should handle empty days', () => {
      const account = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 100000000,
          '2018-01-03': 200000000,
        },
      }

      const interval = {
        start: '2018-01-01',
        end: '2018-01-03',
      }

      const balances = getBalanceHistoryForAccount({
        counterValue: 'USD',
        account,
        counterValues,
        interval,
      })

      expect(balances).toEqual([
        { date: '2018-01-01', balance: 1000 },
        { date: '2018-01-02', balance: 2000 },
        { date: '2018-01-03', balance: 6000 },
      ])
    })

    test('should work if interval dont contain operations', () => {
      const account = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 100000000,
        },
      }

      const interval = {
        start: '2018-01-02',
        end: '2018-01-03',
      }

      const balances = getBalanceHistoryForAccount({
        counterValue: 'USD',
        account,
        counterValues,
        interval,
      })

      expect(balances).toEqual([
        { date: '2018-01-02', balance: 2000 },
        { date: '2018-01-03', balance: 3000 },
      ])
    })
  })

  describe('getBalanceHistoryForAccounts', () => {
    test('should merge multiple accounts balance', () => {
      const account1 = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 100000000,
          '2018-01-02': 200000000,
        },
      }

      const account2 = {
        coinType: 0,
        balanceByDay: {
          '2018-01-02': 500000000,
          '2018-01-04': 600000000,
        },
      }

      const interval = {
        start: '2018-01-01',
        end: '2018-01-04',
      }

      const balances = getBalanceHistoryForAccounts({
        counterValue: 'USD',
        accounts: [account1, account2],
        counterValues,
        interval,
      })

      expect(balances).toEqual([
        { date: '2018-01-01', balance: 1000 },
        { date: '2018-01-02', balance: 14000 },
        { date: '2018-01-03', balance: 21000 },
        { date: '2018-01-04', balance: 32000 },
      ])
    })
  })
})
