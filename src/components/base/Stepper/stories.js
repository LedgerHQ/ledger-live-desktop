// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Stepper from 'components/base/Stepper'
import Button from 'components/base/Button'

import type { StepProps, Step } from 'components/base/Stepper'

const stories = storiesOf('Components/base', module)

const steps: Step[] = [
  {
    id: 'first',
    label: 'first step',
    component: () => <div>first step</div>,
    footer: ({ transitionTo }: StepProps) => (
      <div>
        <Button primary onClick={() => transitionTo('second')}>
          Click to go next
        </Button>
      </div>
    ),
  },
  {
    id: 'second',
    label: 'second step',
    shouldPreventClose: true,
    onBack: ({ transitionTo }: StepProps) => transitionTo('first'),
    component: () => <div>second step (you cant close on this one)</div>,
    footer: ({ transitionTo }: StepProps) => (
      <div>
        <Button primary onClick={() => transitionTo('first')}>
          Click to go prev
        </Button>
      </div>
    ),
  },
]

stories.add('Stepper', () => (
  <Stepper
    onClose={action('onClose')}
    title="Stepper component"
    steps={steps}
    initialStepId="first"
  />
))
