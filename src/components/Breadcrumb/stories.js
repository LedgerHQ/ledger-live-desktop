// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'

import Breadcrumb from 'components/Breadcrumb'

const stories = storiesOf('Breadcrumb', module)

stories.add('basic', () => (
  <Breadcrumb
    currentStep={number('currentStep', 1)}
    items={[
      { label: 'Amount' },
      { label: 'Summary' },
      { label: 'Secure validation' },
      { label: 'Confirmation' },
    ]}
  />
))
