// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'

import MemInfos from '../MemInfos'

const memoryInfos = {
  applicationsSize: 36862,
  freeSize: 118784,
  systemSize: 171776,
  totalAppSlots: 30,
  usedAppSlots: 2,
}

const stories = storiesOf('Components', module)

stories.add('MemInfos', () => <MemInfos memoryInfos={memoryInfos} />)
