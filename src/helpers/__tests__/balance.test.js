import { getBalanceHistoryForAccount, getBalanceHistoryForAccounts } from 'helpers/balance'

const counterValues = {
  BTC: {
    USD: {
      '2018-01-01': 1,
      '2018-01-02': 2,
      '2018-01-03': 3,
      '2018-01-04': 4,
      '2018-01-05': 5,
    },
  },
}

describe('helpers > balance', () => {
  describe('getBalanceHistoryForAccount', () => {
    test('should handle a simple case', () => {
      const account = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 1,
          '2018-01-02': 2,
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
        { date: '2018-01-01', balance: 1 },
        { date: '2018-01-02', balance: 4 },
      ])
    })

    test('should handle empty days', () => {
      const account = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 1,
          '2018-01-03': 2,
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
        { date: '2018-01-01', balance: 1 },
        { date: '2018-01-02', balance: 2 },
        { date: '2018-01-03', balance: 6 },
      ])
    })

    test('should work if interval dont contain operations', () => {
      const account = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 1,
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
        { date: '2018-01-02', balance: 2 },
        { date: '2018-01-03', balance: 3 },
      ])
    })
  })

  describe('getBalanceHistoryForAccounts', () => {
    test('should merge multiple accounts balance', () => {
      const account1 = {
        coinType: 0,
        balanceByDay: {
          '2018-01-01': 1,
          '2018-01-02': 2,
        },
      }

      const account2 = {
        coinType: 0,
        balanceByDay: {
          '2018-01-02': 5,
          '2018-01-04': 6,
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
        { date: '2018-01-01', balance: 1 },
        { date: '2018-01-02', balance: 14 },
        { date: '2018-01-03', balance: 21 },
        { date: '2018-01-04', balance: 32 },
      ])
    })
  })
})
