// @flow

import React from 'react'
import map from 'lodash/map'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

import { fontFamilies, fontSizes } from 'styles/theme'

const stories = storiesOf('Common', module)

const Title = ({ children }: { children: string }) => (
  <Text style={{ fontFamily: 'monospace' }} fontSize={5}>
    {children}
  </Text>
)

const FontStyles = ({ txt }: { txt: string }) => (
  <Box flow={4}>
    <Title>{'Font styles'}</Title>
    {map(fontFamilies, (weights, fontName) => (
      <Box key={fontName}>
        {map(weights, (_, weight) => (
          <Box key={weight} horizontal alignItems="center">
            <Box style={{ width: 200 }}>
              <Text style={{ fontFamily: 'monospace' }} fontSize={3}>
                {fontName} {weight}
              </Text>
            </Box>
            <Text key={weight} ff={`${fontName}|${weight}`}>
              {txt}
            </Text>
          </Box>
        ))}
      </Box>
    ))}
  </Box>
)

const FontSizes = () => (
  <Box flow={4}>
    <Title>{'Font sizes'}</Title>
    <table border="1">
      <tbody>
        {fontSizes.map((size, i) => (
          <tr key={size}>
            <td width={50}>{i}</td>
            <td>{`${size}px`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Box>
)

stories.add('Text styles', () => (
  <Box flow={4}>
    <FontStyles txt={text('text', 'The quick brown fox jumps over the lazy dog')} />
    <FontSizes />
  </Box>
))
