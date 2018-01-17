import React from 'react'
import { storiesOf } from '@storybook/react'

import Select from 'components/base/Select'
import Text from 'components/base/Text'

const stories = storiesOf('Select', module)

const items = [
  { key: 'aleksandr-grichtchouk', name: 'Aleksandr Grichtchouk' },
  { key: 'fabiano-caruana', name: 'Fabiano Caruana' },
  { key: 'garry-kasparov', name: 'Garry Kasparov' },
  { key: 'hikaru-nakamura', name: 'Hikaru Nakamura' },
  { key: 'levon-aronian', name: 'Levon Aronian' },
  { key: 'magnus-carlsen', name: 'Magnus Carlsen' },
  { key: 'maxime-vachier-lagrave', name: 'Maxime Vachier-Lagrave' },
  { key: 'shakhriyar-mamedyarov', name: 'Shakhriyar Mamedyarov' },
  { key: 'veselin-topalov', name: 'Veselin Topalov' },
  { key: 'viswanathan-anand', name: 'Viswanathan Anand' },
  { key: 'vladimir-kramnik', name: 'Vladimir Kramnik' },
]

stories.add('basic', () => (
  <Select
    items={items}
    highlight
    fuseOptions={{ keys: ['name'] }}
    itemToString={item => (item ? item.name : '')}
    renderHighlight={(text, key) => (
      <Text key={key} fontWeight="bold">
        {text}
      </Text>
    )}
  />
))
