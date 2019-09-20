import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const stories = storiesOf('Common', module)

const req = require.context('../icons', true, /.js$/)
const icons = req
  .keys()
  .map(file => {
    const filePath = file
      .split('/')
      .slice(1)
      .join('/')
    let iconName = file.split('/')
    iconName = iconName[iconName.length - 1]
    return {
      filePath: filePath.split('.js')[0],
      iconName: iconName.split('.js')[0],
      Component: req(file).default,
    }
  })
  .filter(i => i.Component)
  .sort((a, b) => a.iconName > b.iconName)

const IconWrapper = styled(Box).attrs(() => ({
  align: 'center',
  justify: 'center',
}))`
  width: 150px;
  height: 150px;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const doubleClickMap = {}

function copy(filePath, iconName) {
  return () => {
    const now = Date.now()
    const isDoubleClick = iconName in doubleClickMap && now - doubleClickMap[iconName] < 250
    doubleClickMap[iconName] = now
    const fakeNode = document.createElement('textarea')
    fakeNode.value = isDoubleClick ? `import Icon${iconName} from 'icons/${filePath}'` : iconName
    document.body.appendChild(fakeNode)
    fakeNode.select()
    document.execCommand('copy')
    document.body.removeChild(fakeNode)
  }
}

stories.add('Icons', () => (
  <Wrapper>
    {icons.map(({ iconName, filePath, Component }) => (
      <IconWrapper onClick={copy(filePath, iconName)} key={iconName}>
        <div style={{ marginBottom: 15 }}>{iconName}</div>
        <Component size={32} />
      </IconWrapper>
    ))}
  </Wrapper>
))
