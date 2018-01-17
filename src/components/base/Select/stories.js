import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react'

import Box from 'components/base/Box'
import Select from 'components/base/Select'
import Text from 'components/base/Text'

const stories = storiesOf('Select', module)

const itemsChessPlayers = [
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

class Wrapper extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  state = {
    item: null,
  }

  handleChange = item => this.setState({ item })

  render() {
    const { children } = this.props
    const { item } = this.state
    return (
      <div>
        {children(this.handleChange)}
        {item && (
          <Box mt={2}>
            <pre>
              {'You selected:'}
              {JSON.stringify(item)}
            </pre>
          </Box>
        )}
      </div>
    )
  }
}

stories.add('basic', () => (
  <Wrapper>
    {onChange => (
      <Select
        placeholder="Choose a chess player..."
        items={itemsChessPlayers}
        renderSelected={item => item.name}
        onChange={onChange}
      />
    )}
  </Wrapper>
))

stories.add('searchable', () => (
  <Select
    placeholder="Choose a chess player..."
    items={itemsChessPlayers}
    searchable
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

const itemsColors = [
  { key: 'absolute zero', name: 'Absolute Zero', color: '#0048BA' },
  { key: 'acid green', name: 'Acid Green', color: '#B0BF1A' },
  { key: 'aero', name: 'Aero', color: '#7CB9E8' },
  { key: 'aero blue', name: 'Aero Blue', color: '#C9FFE5' },
  { key: 'african violet', name: 'African Violet', color: '#B284BE' },
  { key: 'air force blue (usaf)', name: 'Air Force Blue (USAF)', color: '#00308F' },
  { key: 'air superiority blue', name: 'Air Superiority Blue', color: '#72A0C1' },
]

stories.add('custom render', () => (
  <Select
    items={itemsColors}
    highlight
    searchable
    fuseOptions={{ keys: ['name', 'color'] }}
    itemToString={item => (item ? item.name : '')}
    renderHighlight={(text, key) => (
      <Text key={key} fontWeight="bold">
        {text}
      </Text>
    )}
    renderItem={item => (
      <Box horizontal flow={2}>
        <Box bg={item.color} style={{ width: 20, height: 20 }} />
        <span>{item.name_highlight || item.name}</span>
      </Box>
    )}
  />
))
