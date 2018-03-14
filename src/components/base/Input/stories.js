// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import Input from 'components/base/Input'

const stories = storiesOf('Components', module)

stories.add('Input', () => <Input placeholder="Foo bar" />)
