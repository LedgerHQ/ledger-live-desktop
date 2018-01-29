// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'

import Icon from 'components/base/Icon'

const stories = storiesOf('Icon', module)

const Wrapper = ({ children }: { children: any }) => (
  <div>
    <div style={{ opacity: 0.2 }}>
      (Change the icon value with{' '}
      <a
        href="https://fontawesome.com/icons?d=gallery&s=regular,solid&m=free"
        target="_blank"
        style={{ cursor: 'pointer' }}
      >
        FontAwesome
      </a>{' '}
      icon)
    </div>
    {children}
  </div>
)

stories.add('basic', () => (
  <Wrapper>
    <Icon
      color={text('color', 'black')}
      fontSize={number('fontSize', 5)}
      name={text('icon', 'check')}
    />
  </Wrapper>
))
