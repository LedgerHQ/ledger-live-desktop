import React from 'react'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import render from '__mocks__/render'
import FormattedVal from '..'

const bitcoinUnit = getCryptoCurrencyById('bitcoin').units[0]

describe('components', () => {
  describe('FormattedVal', () => {
    it('renders a formatted val', () => {
      const component = <FormattedVal unit={bitcoinUnit} val={400000000} />
      const tree = render(component)
      expect(tree).toMatchSnapshot()
    })

    it('shows sign', () => {
      const component = <FormattedVal alwaysShowSign unit={bitcoinUnit} val={400000000} />
      const tree = render(component)
      expect(tree).toMatchSnapshot()

      const component2 = <FormattedVal alwaysShowSign unit={bitcoinUnit} val={-400000000} />
      const tree2 = render(component2)
      expect(tree2).toMatchSnapshot()
    })

    it('shows code', () => {
      const component = <FormattedVal showCode unit={bitcoinUnit} val={400000000} />
      const tree = render(component)
      expect(tree).toMatchSnapshot()
    })

    it('renders a percent', () => {
      const component = <FormattedVal isPercent val={30} />
      const tree = render(component)
      expect(tree).toMatchSnapshot()
    })
  })
})
