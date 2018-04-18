// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import Button from 'components/base/Button'

const stories = storiesOf('Components/base', module)

const Th = styled.th`
  padding: 20px;
`

const Td = styled.td`
  padding: 20px;
  min-width: 150px;
`

stories.add('Button', () => (
  <table border={1}>
    <thead>
      <tr>
        <Th />
        <Th>normal</Th>
        <Th>disabled</Th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <Td>normal</Td>
        <Td>
          <Button>Normal button</Button>
        </Td>
        <Td>
          <Button disabled>Normal button</Button>
        </Td>
      </tr>
      <tr>
        <Td>primary</Td>
        <Td>
          <Button primary>Primary button</Button>
        </Td>
        <Td>
          <Button primary disabled>
            Primary button
          </Button>
        </Td>
      </tr>
      <tr>
        <Td>danger</Td>
        <Td>
          <Button danger>Danger button</Button>
        </Td>
        <Td>
          <Button danger disabled>
            Danger button
          </Button>
        </Td>
      </tr>
      <tr>
        <Td>outline</Td>
        <Td>
          <Button outline>Outline button</Button>
        </Td>
        <Td>
          <Button outline disabled>
            Outline button
          </Button>
        </Td>
      </tr>
    </tbody>
  </table>
))
