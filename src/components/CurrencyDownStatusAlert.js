// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import type { CurrencyStatus } from 'reducers/currenciesStatus'
import { currencyDownStatus } from 'reducers/currenciesStatus'
import { openURL } from 'helpers/linking'
import Box from 'components/base/Box'
import IconTriangleWarning from 'icons/TriangleWarning'
import IconExternalLink from 'icons/ExternalLink'

type Props = {
  t: *,
  status: ?CurrencyStatus,
}

const CurrencyDownBox = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'center',
  color: 'palette.background.paper',
  borderRadius: 1,
  fontSize: 1,
  px: 4,
  py: 2,
  mb: 4,
}))`
  background-color: ${p => (p.warning ? p.theme.colors.orange : p.theme.colors.alertRed)};
`

const Link = styled.span`
  margin-left: 5px;
  margin-right: 5px;
  text-decoration: underline;
  cursor: pointer;
`

class CurrencyDownStatusAlert extends PureComponent<Props> {
  onClick = () => {
    const { status } = this.props
    if (status) openURL(status.link)
  }

  render() {
    const { status, t } = this.props
    if (!status) return null
    return (
      <CurrencyDownBox warning={!!status.warning}>
        <Box mr={2}>
          <IconTriangleWarning height={16} width={16} />
        </Box>
        <Box style={{ display: 'block' }} ff="Inter|SemiBold" fontSize={3} horizontal shrink>
          {status.message}
          <Link onClick={this.onClick}>{t('common.learnMore')}</Link>
          <IconExternalLink size={12} />
        </Box>
      </CurrencyDownBox>
    )
  }
}
export default connect(
  createStructuredSelector({
    status: currencyDownStatus,
  }),
)(translate()(CurrencyDownStatusAlert))
