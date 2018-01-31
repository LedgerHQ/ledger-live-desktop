import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import RecipientAddress from 'components/RecipientAddress'

const stories = storiesOf('RecipientAddress', module)

stories.add('basic', () => <RecipientAddress withQrCode={boolean('withQrCode', true)} />)
