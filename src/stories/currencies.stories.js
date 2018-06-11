// @flow

import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react'
import { listCryptoCurrencies } from 'config/cryptocurrencies'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

const stories = storiesOf('Common', module)

const currencies: Array<CryptoCurrency> = listCryptoCurrencies()

stories.add('Currencies', () => (
  <div>
    <table border="1">
      <thead>
        <tr>
          <td>{'id'}</td>
          <td>{'name'}</td>
          <td>{'color'}</td>
          <td>{'icon'}</td>
          <td>{'units'}</td>
        </tr>
      </thead>
      <tbody>
        {currencies.map(cur => {
          const Icon = getCryptoCurrencyIcon(cur)
          return (
            <tr key={cur.id}>
              <td>{cur.id}</td>
              <td>{cur.name}</td>
              <td>
                {cur.color ? (
                  <Fragment>
                    <div
                      style={{
                        width: 50,
                        height: 25,
                        backgroundColor: cur.color,
                      }}
                    />
                    <div>{cur.color}</div>
                  </Fragment>
                ) : (
                  '-'
                )}
              </td>
              <td>{Icon ? <Icon size={30} /> : '-'}</td>
              <td>
                {cur.units && (
                  <ul style={{ paddingRight: 10 }}>
                    {cur.units.map(unit => (
                      <li key={unit.code} style={{ listStyleType: 'none' }}>
                        {unit.code} ({unit.magnitude})
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
))
