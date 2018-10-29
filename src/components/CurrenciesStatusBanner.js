// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import type { Currency } from '@ledgerhq/live-common/lib/types'

import logger from 'logger'
import { colors } from 'styles/theme'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import { CHECK_CUR_STATUS_INTERVAL } from 'config/constants'
import network from 'api/network'
import IconCross from 'icons/Cross'
import IconTriangleWarning from 'icons/TriangleWarning'
import IconChevronRight from 'icons/ChevronRight'

import { dismissedBannersSelector } from 'reducers/settings'
import { currenciesSelector } from 'reducers/accounts'
import { dismissBanner } from 'actions/settings'

import Box from 'components/base/Box'

type ResultItem = {
  id: string,
  status: string,
  message: string,
  link: string,
  nonce: number,
}

const mapStateToProps = createStructuredSelector({
  dismissedBanners: dismissedBannersSelector,
  accountsCurrencies: currenciesSelector,
})

const mapDispatchToProps = {
  dismissBanner,
}

const getItemKey = (item: ResultItem) => `${item.id}_${item.nonce}`

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
    <IconCross size={16} color="white" />
  </CloseIconContainer>
)

type Props = {
  accountsCurrencies: Currency[],
  dismissedBanners: string[],
  dismissBanner: string => void,
  t: *,
}

type State = {
  result: ResultItem[],
}

class CurrenciesStatusBanner extends PureComponent<Props, State> {
  state = {
    result: [],
  }

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

  pollStatus = () => {
    this.fetchStatus()
    this.timeout = setTimeout(this.pollStatus, CHECK_CUR_STATUS_INTERVAL)
  }

  fetchStatus = async () => {
    try {
      const baseUrl = process.env.LL_STATUS_API || urls.currenciesStatus
      const { data } = await network({
        method: 'GET',
        url: `${baseUrl}/currencies-status`,
      })
      if (this.unmounted) return
      this.setState({ result: data })
    } catch (err) {
      logger.error(err)
    }
  }

  dismiss = item => this.props.dismissBanner(getItemKey(item))

  render() {
    const { dismissedBanners, accountsCurrencies, t } = this.props
    const { result } = this.state
    if (!result) return null
    const filtered = result.filter(
      item =>
        accountsCurrencies.find(cur => cur.id === item.id) &&
        dismissedBanners.indexOf(getItemKey(item)) === -1,
    )
    if (!filtered.length) return null
    return (
      <Box flow={2} style={styles.container}>
        {filtered.map(r => <BannerItem key={r.id} t={t} item={r} onItemDismiss={this.dismiss} />)}
      </Box>
    )
  }
}

class BannerItem extends PureComponent<{
  item: ResultItem,
  onItemDismiss: ResultItem => void,
  t: *,
}> {
  onLinkClick = () => openURL(this.props.item.link)
  dismiss = () => this.props.onItemDismiss(this.props.item)
  render() {
    const { item, t } = this.props
    return (
      <Box relative key={item.id} style={styles.banner}>
        <CloseIcon onClick={this.dismiss} />
        <Box horizontal flow={2}>
          <IconTriangleWarning height={16} width={16} color="white" />
          <Box shrink ff="Open Sans|SemiBold">
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
    border-bottom-color: white;
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
    color="white"
  >
    <IconChevronRight size={16} color="white" />
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
    background: colors.alertRed,
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: 13,
    padding: 14,
    color: 'white',
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
