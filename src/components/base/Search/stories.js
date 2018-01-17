import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, boolean } from '@storybook/addon-knobs'

import Search from 'components/base/Search'

const stories = storiesOf('Search', module)

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

const Wrapper = ({ children }: { children: any }) => (
  <div>
    <div style={{ opacity: 0.2 }}>{'(Change the search value in knobs)'}</div>
    {children}
  </div>
)

stories.add('basic', () => {
  const value = text('value', '')
  const filterEmpty = boolean('filterEmpty', false)
  return (
    <Wrapper>
      <Search
        value={value}
        items={items}
        filterEmpty={filterEmpty}
        fuseOptions={{
          keys: ['name'],
        }}
        render={items => items.map(item => <div key={item.name}>{item.name}</div>)}
      />
    </Wrapper>
  )
})

stories.add('highlight matches', () => {
  const value = text('value', '')
  const filterEmpty = boolean('filterEmpty', false)
  return (
    <Wrapper>
      <Search
        value={value}
        items={items}
        filterEmpty={filterEmpty}
        highlight
        fuseOptions={{
          keys: ['name'],
        }}
        renderHighlight={(text, key) => (
          <b key={key} style={{ textDecoration: 'underline', color: 'red' }}>
            {text}
          </b>
        )}
        render={items => items.map(item => <div key={item.key}>{item.name}</div>)}
      />
    </Wrapper>
  )
})
