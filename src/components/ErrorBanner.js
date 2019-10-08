// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Box from 'components/base/Box'
import IconTriangleWarning from 'icons/TriangleWarning'
import TranslatedError from './TranslatedError'

type Props = {
  error: Error,
  warning?: boolean,
}

const ErrorBannerBox = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'flex-start',
  color: 'palette.background.paper',
  borderRadius: 1,
  fontSize: 1,
  px: 4,
  py: 2,
  mb: 4,
}))`
  background-color: ${p => (p.warning ? p.theme.colors.orange : p.theme.colors.alertRed)};
`

class ErrorBanner extends PureComponent<Props> {
  onClick = () => {}

  render() {
    const { error, warning } = this.props
    return (
      <ErrorBannerBox warning={warning}>
        <Box mr={2} alignSelf="center">
          <IconTriangleWarning height={16} width={16} />
        </Box>
        <Box ff="Inter|SemiBold" fontSize={3} vertical shrink>
          <Box>
            <TranslatedError error={error} />
          </Box>
          <Box>
            <TranslatedError error={error} field="description" />
          </Box>
        </Box>
      </ErrorBannerBox>
    )
  }
}
export default ErrorBanner
