// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import { openURL } from 'helpers/linking'
import { CHECK_CUR_STATUS_INTERVAL } from 'config/constants'
import IconCross from 'icons/Cross'
import IconTriangleWarning from 'icons/TriangleWarning'
import IconChevronRight from 'icons/ChevronRight'

import { dismissedBannersSelector } from 'reducers/settings'
import { currenciesStatusSelector, fetchCurrenciesStatus } from 'reducers/currenciesStatus'
import { currenciesSelector } from 'reducers/accounts'
import { dismissBanner } from 'actions/settings'
import type { CurrencyStatus } from 'reducers/currenciesStatus'

import Box from 'components/base/Box'

const mapStateToProps = createStructuredSelector({
  dismissedBanners: dismissedBannersSelector,
  accountsCurrencies: currenciesSelector,
  currenciesStatus: currenciesStatusSelector,
})

const mapDispatchToProps = {
  dismissBanner,
  fetchCurrenciesStatus,
}

const getItemKey = (item: CurrencyStatus) => `${item.id}_${item.nonce}`

const CloseIconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-bottom-left-radius: 4px;

  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`

const CloseIcon = (props: *) => (
  <CloseIconContainer {...props}>
    <IconCross size={16} color="palette.background.paper" />
  </CloseIconContainer>
)

type Props = {
  accountsCurrencies: CryptoCurrency[],
  dismissedBanners: string[],
  dismissBanner: string => void,
  currenciesStatus: CurrencyStatus[],
  fetchCurrenciesStatus: () => Promise<void>,
  t: *,
}

class CurrenciesStatusBanner extends PureComponent<Props> {
  componentDidMount() {
    this.pollStatus()
  }

  componentWillUnmount() {
    this.unmounted = true
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  unmounted = false
  timeout: *

  pollStatus = async () => {
    await this.props.fetchCurrenciesStatus()
    if (this.unmounted) return
    this.timeout = setTimeout(this.pollStatus, CHECK_CUR_STATUS_INTERVAL)
  }

  dismiss = item => this.props.dismissBanner(getItemKey(item))

  render() {
    const { dismissedBanners, accountsCurrencies, currenciesStatus, t } = this.props

    const filtered = currenciesStatus.filter(
      item =>
        accountsCurrencies.find(cur => cur.id === item.id) &&
        dismissedBanners.indexOf(getItemKey(item)) === -1,
    )

    if (!filtered.length) return null
    return (
      <Box flow={2} style={styles.container}>
        {filtered.map(r => (
          <BannerItem key={`${r.id}_${r.nonce}`} t={t} item={r} onItemDismiss={this.dismiss} />
        ))}
      </Box>
    )
  }
}

class BannerItem extends PureComponent<{
  item: CurrencyStatus,
  onItemDismiss: CurrencyStatus => void,
  t: *,
}> {
  onLinkClick = () => openURL(this.props.item.link)
  dismiss = () => this.props.onItemDismiss(this.props.item)
  render() {
    const { item, t } = this.props
    return (
      <Box relative key={item.id} bg={item.warning ? 'orange' : 'alertRed'} style={styles.banner}>
        <CloseIcon onClick={this.dismiss} />
        <Box horizontal flow={2}>
          <IconTriangleWarning height={16} width={16} color="palette.background.paper" />
          <Box shrink ff="Inter|SemiBold">
            {item.message}
          </Box>
        </Box>
        {item.link && <BannerItemLink t={t} onClick={this.onLinkClick} />}
      </Box>
    )
  }
}

const UnderlinedLink = styled.span`
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom-color: ${p => p.theme.colors.palette.background.paper};
  }
`

const BannerItemLink = ({ t, onClick }: { t: *, onClick: void => * }) => (
  <Box
    mt={2}
    ml={4}
    flow={1}
    horizontal
    align="center"
    cursor="pointer"
    onClick={onClick}
    color="palette.background.paper"
  >
    <IconChevronRight size={16} color="palette.background.paper" />
    <UnderlinedLink>{t('common.learnMore')}</UnderlinedLink>
  </Box>
)

const styles = {
  container: {
    position: 'fixed',
    left: 32,
    bottom: 32,
  },
  banner: {
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: 13,
    padding: 14,
    color: 'palette.background.paper',
    fontWeight: 'bold',
    paddingRight: 50,
    width: 350,
  },
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(CurrenciesStatusBanner)
