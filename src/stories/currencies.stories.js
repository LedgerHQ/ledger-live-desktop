// @flow

import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react'
import { listCurrencies } from '@ledgerhq/currencies'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { Currency } from '@ledgerhq/currencies'

const stories = storiesOf('Common', module)

const currencies: Array<Currency> = listCurrencies()

stories.add('Currencies', () => (
  <div>
    <table border="1">
      <thead>
        <tr>
          <td>{'coin type'}</td>
          <td>{'name'}</td>
          <td>{'color'}</td>
          <td>{'icon'}</td>
          <td>{'units'}</td>
        </tr>
      </thead>
      <tbody>
        {currencies.map(cur => {
          const Icon = getIconByCoinType(cur.coinType)
          return (
            <tr key={cur.coinType}>
              <td>{cur.coinType}</td>
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
                      <li key={unit.code}>
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
