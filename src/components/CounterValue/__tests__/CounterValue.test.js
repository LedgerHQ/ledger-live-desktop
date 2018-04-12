// @flow

import React from 'react'

import render from '__mocks__/render'
import CounterValue from '..'

describe('components', () => {
  describe('CounterValue', () => {
    it('basic', () => {
      const state = { counterValues: { BTC: { USD: { latest: 10e2 } } } }
      const component = <CounterValue ticker="BTC" value={1} />
      const tree = render(component, state)
      expect(tree).toMatchSnapshot()
    })

    it('specifying ticker different from default', () => {
      const state = { counterValues: { LOL: { USD: { latest: 5e2 } } } }
      const component = <CounterValue ticker="LOL" value={1} />
      const tree = render(component, state)
      expect(tree).toMatchSnapshot()
    })

    it('using countervalue different from default', () => {
      const state = {
        counterValues: { BTC: { EUR: { latest: 42 } } },
        settings: {
          counterValue: 'EUR',
        },
      }
      const component = <CounterValue ticker="BTC" value={1} />
      const tree = render(component, state)
      expect(tree).toMatchSnapshot()
    })

    it('without countervalues populated', () => {
      const state = { counterValues: {} }
      const component = <CounterValue ticker="BTC" value={1} />
      const tree = render(component, state)
      expect(tree).toMatchSnapshot()
    })

    it('with time travel whith date in countervalues', () => {
      const state = { counterValues: { BTC: { USD: { '2018-01-01': 20e2 } } } }

      const date = new Date('2018-01-01')
      const component = <CounterValue ticker="BTC" value={1} date={date} />
      const tree = render(component, state)
      expect(tree).toMatchSnapshot()
    })

    it('with time travel whith date not in countervalues', () => {
      const state = { counterValues: { BTC: { USD: { '2018-01-01': 20e2 } } } }
      const date = new Date('2018-01-02')
      const component = <CounterValue ticker="BTC" value={1} date={date} />
      const tree = render(component, state)

      // TODO: actually it returns 0 when date is not in countervalues
      // do we want to use closest past value instead?
      expect(tree).toMatchSnapshot()
    })
  })
})
