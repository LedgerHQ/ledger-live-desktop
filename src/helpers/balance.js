// @flow

import moment from 'moment'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import find from 'lodash/find'
import first from 'lodash/first'
import isUndefined from 'lodash/isUndefined'
import last from 'lodash/last'

import type { Account } from 'types/common'

type DateInterval = {
  start: string,
  end: string,
}

type BalanceHistoryDay = {
  date: string,
  balance: number,
}

type CalculateBalance = {
  accounts: Account[],
  counterValue: string,
  counterValues: Object,
  daysCount: number,
}

// Map the given date interval
// iteratee is given day, index, and currently constructed array
// (exactly like Array.map)
function mapInterval(iv: DateInterval, cb: Function) {
  const res = []
  let startDate = moment(iv.start)
  let i = 0
  const endDate = moment(iv.end)
  res.push(cb(startDate.format('YYYY-MM-DD'), i, res))
  while (!startDate.isSame(endDate, 'day')) {
    startDate = startDate.add(1, 'day')
    res.push(cb(startDate.format('YYYY-MM-DD'), ++i, res))
  }
  return res
}

function getBalanceAtIntervalStart(account: Account, interval: DateInterval): number | null {
  const target = moment(interval.start)
  let res = 0
  for (const i in account.balanceByDay) {
    if (account.balanceByDay.hasOwnProperty(i)) {
      const d = moment(i)
      if (!d.isBefore(target, 'day')) {
        break
      }
      res = account.balanceByDay[i] || 0
    }
  }
  return res
}

export function getBalanceHistoryForAccount({
  account,
  counterValue,
  counterValues,
  interval,
}: {
  counterValue: string,
  account: Account,
  counterValues: Object,
  interval: DateInterval,
}): Array<BalanceHistoryDay> {
  const unit = getDefaultUnitByCoinType(account.coinType)
  const counterVals = counterValues[`${unit.code}-${counterValue}`].byDate
  let lastBalance = getBalanceAtIntervalStart(account, interval)
  return mapInterval(interval, date => {
    let balance = 0

    if (!counterVals) {
      return { balance, date }
    }

    // if we don't have data on account balance for that day,
    // we take the prev day
    if (isUndefined(account.balanceByDay[date])) {
      balance = lastBalance === null ? 0 : lastBalance / 10 ** unit.magnitude * counterVals[date]
    } else {
      const b = account.balanceByDay[date]
      lastBalance = b
      balance = b / 10 ** unit.magnitude * counterVals[date]
    }

    if (isNaN(balance)) {
      console.warn(`This should not happen. Cant calculate balance for ${date}`) // eslint-disable-line no-console
      return { date, balance: 0 }
    }

    return { date, balance }
  })
}

export function getBalanceHistoryForAccounts({
  accounts,
  counterValue,
  counterValues,
  interval,
}: {
  counterValue: string,
  accounts: Account[],
  counterValues: Object,
  interval: DateInterval,
}): Array<BalanceHistoryDay> {
  // calculate balance history for each account on the given interval
  const balances = accounts.map(account =>
    getBalanceHistoryForAccount({
      counterValue,
      account,
      counterValues,
      interval,
    }),
  )

  // if more than one account, addition all balances, day by day
  // and returns a big summed up array
  return balances.length > 1
    ? balances[0].map((item, i) => {
        let b = item.balance
        for (let j = 1; j < balances.length; j++) {
          b += balances[j][i].balance
        }
        return { ...item, balance: b }
      })
    : balances.length > 0 ? balances[0] : []
}

export default function calculateBalance(props: CalculateBalance) {
  const interval = {
    start: moment()
      .subtract(props.daysCount, 'days')
      .format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  }

  const allBalances = getBalanceHistoryForAccounts({
    counterValue: props.counterValue,
    accounts: props.accounts,
    counterValues: props.counterValues,
    interval,
  }).map(e => ({ date: e.date, value: e.balance }))

  const firstNonEmptyDay = find(allBalances, e => e.value)
  const refBalance = firstNonEmptyDay ? firstNonEmptyDay.value : 0

  return {
    allBalances,
    totalBalance: last(allBalances).value,
    sinceBalance: first(allBalances).value,
    refBalance,
  }
}
