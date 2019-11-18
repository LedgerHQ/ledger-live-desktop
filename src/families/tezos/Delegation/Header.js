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
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
  }

  > *:first-of-type,
  > *:nth-of-type(2) {
    flex: 1.5;
  }

  > *:last-of-type {
    flex: 0.5;
  }
`

export default () => (
  <Wrapper>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'delegation.validator'} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'delegation.transactionID'} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'delegation.value'} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'delegation.amount'} />
    </Text>
    <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
      <Trans i18nKey={'delegation.duration'} />
    </Text>
    <Text />
  </Wrapper>
)
