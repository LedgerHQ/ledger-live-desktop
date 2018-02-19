// @flow

import React, { Fragment, createElement } from 'react'
import { storiesOf } from '@storybook/react'

import { listCurrencies } from '@ledgerhq/currencies'
import type { Currency } from '@ledgerhq/currencies'

const stories = storiesOf('currencies', module)

const currencies: Array<Currency> = listCurrencies()

stories.add('currencies list', () => (
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
        {currencies.map(cur => (
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
            <td>{cur.icon ? createElement(cur.icon, { size: 30 }) : '-'}</td>
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
        ))}
      </tbody>
    </table>
  </div>
))
