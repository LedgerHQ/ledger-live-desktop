// @flow

import React from 'react'
import styled from 'styled-components'
import Text from 'components/base/Text'
import { Trans } from 'react-i18next'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  > * {
    width: 20%;
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
  }

  > *:nth-of-type(4) {
    width: 25%;
  }
  > *:nth-of-type(5) {
    width: 15%;
  }
`

export default () => (
  <Wrapper>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'distribution.asset'} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'distribution.price'} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'distribution.distribution'} />
    </Text>
    <Text
      ff="Inter|SemiBold"
      color="palette.text.shade60"
      style={{ justifyContent: 'flex-end' }}
      fontSize={3}
    >
      <Trans i18nKey={'distribution.amount'} />
    </Text>
    <Text
      ff="Inter|SemiBold"
      color="palette.text.shade60"
      style={{ justifyContent: 'flex-end' }}
      fontSize={3}
    >
      <Trans i18nKey={'distribution.value'} />
    </Text>
  </Wrapper>
)
