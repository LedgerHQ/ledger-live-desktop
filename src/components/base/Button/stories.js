// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import Button from 'components/base/Button'

const stories = storiesOf('Components/Button', module)

stories.add('basic', () => <Button>{'Do some action'}</Button>)
stories.add('primary', () => <Button primary>{'Validate'}</Button>)
