// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import InputCurrency from 'components/base/InputCurrency'

const stories = storiesOf('Components/InputCurrency', module)

const unit = getDefaultUnitByCoinType(1)

stories.add('basic', () => <InputCurrency unit={unit} onChange={action('onChange')} />)
