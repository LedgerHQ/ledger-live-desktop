// @flow

import React from 'react'
import styled from 'styled-components'
import { Route } from 'react-router'

import { translate } from 'react-i18next'
import AccountCrumb from './AccountCrumb'
import AssetCrumb from './AssetCrumb'

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
    font-family: 'Inter';
    font-weight: 600;
    font-size: 12px;
    color: ${p => p.theme.colors.palette.text.shade60};
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
    color: ${p => p.theme.colors.palette.divider};
    padding: 0 15px;
  }
`
const Breadcrumb = () => (
  <Wrapper>
    <Route path="/account/" component={AccountCrumb} />
    <Route path="/account/:id/" component={AccountCrumb} />
    <Route path="/account/:parentId/:id/" component={AccountCrumb} />

    <Route path="/asset/:assetTicker/" component={AssetCrumb} />
  </Wrapper>
)

export default translate()(Breadcrumb)
