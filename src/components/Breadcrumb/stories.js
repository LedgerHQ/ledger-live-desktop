// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'

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
        min: 1,
        max: 4,
      })}
      items={[
        { label: 'Amount' },
        { label: 'Summary' },
        { label: 'Secure validation' },
        { label: 'Confirmation' },
      ]}
    />
  </div>
))
