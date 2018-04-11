// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { array, number } from '@storybook/addon-knobs'

import Breadcrumb from 'components/Breadcrumb'

const stories = storiesOf('Components', module)

stories.add('Breadcrumb', () => (
  <div
    style={{
      width: 400,
    }}
  >
    <Breadcrumb
      currentStep={number('currentStep', 1, {
        min: 0,
        max: 3,
      })}
      stepsDisabled={array('stepsDisabled', []).map(a => Number(a))}
      stepsErrors={array('stepsErrors', []).map(a => Number(a))}
      items={[
        { label: 'Amount' },
        { label: 'Summary' },
        { label: 'Secure validation' },
        { label: 'Confirmation' },
      ]}
    />
  </div>
))
