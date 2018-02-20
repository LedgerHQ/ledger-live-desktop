// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'

import Input from 'components/base/Input'

const stories = storiesOf('Components/Input', module)

stories.add('basic', () => <Input placeholder="Foo bar" />)
