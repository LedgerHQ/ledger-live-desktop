import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const stories = storiesOf('Common', module)

const req = require.context('../icons', true, /.js$/)
const icons = req.keys().map(file => ({
  file,
  Component: req(file).default,
}))

const IconWrapper = styled(Box).attrs({
  align: 'center',
  justify: 'center',
})`
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

function copy(iconName) {
  return () => {
    const now = Date.now()
    const isDoubleClick = iconName in doubleClickMap && now - doubleClickMap[iconName] < 250
    doubleClickMap[iconName] = now
    const fakeNode = document.createElement('textarea')
    fakeNode.value = isDoubleClick ? `import Icon${iconName} from 'icons/${iconName}'` : iconName
    document.body.appendChild(fakeNode)
    fakeNode.focus()
    fakeNode.select()
    document.execCommand('copy')
    document.body.removeChild(fakeNode)
  }
}

stories.add('Icons', () => (
  <Wrapper>
    {icons.map(({ file, Component }) => {
      const iconName = file.match(/\.\/(.*)\./)[1]
      return (
        <IconWrapper onClick={copy(iconName)} key={iconName}>
          <div style={{ marginBottom: 15 }}>{iconName}</div>
          <Component size={32} width={32} height={32} />
        </IconWrapper>
      )
    })}
  </Wrapper>
))
