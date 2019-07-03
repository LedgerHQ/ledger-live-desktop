// @flow

import React from 'react'
import styled from 'styled-components'
import { Route } from 'react-router'

import { translate } from 'react-i18next'
import AccountCrumb from './AccountCrumb'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  width: 0;
  flex-shrink: 1;
  text-overflow: ellipsis;
  break-word: break-all;
  white-space: nowrap;
  > * {
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 12px;
    color: ${p => p.theme.colors.grey};
  }

  > :first-child {
    padding: 0px;
    &:hover {
      background: transparent;
      text-decoration: underline;
    }
  }
`

export const Separator = styled.div`
  &::after {
    content: '/';
    font-size: 13px;
    color: ${p => p.theme.colors.fog};
    padding: 0 15px;
  }
`
const Breadcrumb = () => (
  <Wrapper>
    <Route path="/account/" component={AccountCrumb} />
    <Route path="/account/:id/" component={AccountCrumb} />
    <Route path="/account/:parentId/:id/" component={AccountCrumb} />
  </Wrapper>
)

export default translate()(Breadcrumb)
