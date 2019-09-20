// @flow

import styled from 'styled-components'

export const FakeLink = styled.span.attrs(() => ({
  color: 'wallet',
}))`
  text-decoration: underline;
  cursor: pointer;
`

export default styled.a`
  cursor: pointer;
  text-decoration-skip: ink;
`
