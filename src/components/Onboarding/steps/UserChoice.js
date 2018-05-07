// @flow

import React from 'react'

import Button from 'components/base/Button'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { jumpStep } = props
  return (
    <div>
      hey im step user choice
      <Button onClick={() => jumpStep('init')}>press me for going to prev</Button>
    </div>
  )
}
