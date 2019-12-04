// @flow
import React from 'react'
import Text from 'components/base/Text'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

const PlaceholderWrapper = styled.div`
  text-align: center;
  padding: 20px;
`

const Placeholder = ({ installed, search }: { installed: boolean, search: string }) => (
  <PlaceholderWrapper>
    <Text ff="Inter|SemiBold" fontSize={6}>
      <Trans
        i18nKey={
          installed ? 'managerv2.applist.placeholderInstalled' : 'managerv2.applist.placeholder'
        }
        values={{ search }}
      />
    </Text>
  </PlaceholderWrapper>
)

export default Placeholder
