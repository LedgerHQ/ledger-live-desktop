// @flow

import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'

import QRCode from 'components/base/QRCode'

const stories = storiesOf('QRCode', module)

stories.add('basic', () => <QRCode data={text('data', 'sample')} size={number('size', 200)} />)
