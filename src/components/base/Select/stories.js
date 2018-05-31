// @flow

import React, { PureComponent } from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import Box from 'components/base/Box'
import Select from 'components/base/Select'

const stories = storiesOf('Components/base/Select', module)

const itemsChessPlayers = [
  { value: 'aleksandr-grichtchouk', label: 'Aleksandr Grichtchouk' },
  { value: 'fabiano-caruana', label: 'Fabiano Caruana' },
  { value: 'garry-kasparov', label: 'Garry Kasparov' },
  { value: 'hikaru-nakamura', label: 'Hikaru Nakamura' },
  { value: 'levon-aronian', label: 'Levon Aronian' },
  { value: 'magnus-carlsen', label: 'Magnus Carlsen' },
  { value: 'maxime-vachier-lagrave', label: 'Maxime Vachier-Lagrave' },
  { value: 'shakhriyar-mamedyarov', label: 'Shakhriyar Mamedyarov' },
  { value: 'veselin-topalov', label: 'Veselin Topalov' },
  { value: 'viswanathan-anand', label: 'Viswanathan Anand' },
  { value: 'vladimir-kramnik', label: 'Vladimir Kramnik' },
]

type State = {
  item: Object | null,
}

stories.add('basic', () => (
  <Wrapper>
    {onChange => (
      <Select
        disabled={boolean('disabled', false)}
        placeholder="Choose a chess player..."
        options={itemsChessPlayers}
        renderSelected={item => item.name}
        onChange={onChange}
      />
    )}
  </Wrapper>
))

const itemsColors = [
  { value: 'absolute zero', label: 'Absolute Zero', color: '#0048BA' },
  { value: 'acid green', label: 'Acid Green', color: '#B0BF1A' },
  { value: 'aero', label: 'Aero', color: '#7CB9E8' },
  { value: 'aero blue', label: 'Aero Blue', color: '#C9FFE5' },
  { value: 'african violet', label: 'African Violet', color: '#B284BE' },
  { value: 'air force blue (usaf)', label: 'Air Force Blue (USAF)', color: '#00308F' },
  { value: 'air superiority blue', label: 'Air Superiority Blue', color: '#72A0C1' },
]

stories.add('custom render', () => (
  <Wrapper>
    {onChange => (
      <Select
        placeholder="Choose a color..."
        options={itemsColors}
        onChange={onChange}
        renderOption={item => (
          <Box horizontal flow={2}>
            <Box bg={item.data.color} style={{ width: 20, height: 20 }} />
            <span>{item.label}</span>
          </Box>
        )}
      />
    )}
  </Wrapper>
))

class Wrapper extends PureComponent<any, State> {
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
