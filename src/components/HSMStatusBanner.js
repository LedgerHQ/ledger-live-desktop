// @flow

import React, { PureComponent } from 'react'
import { warnings } from '@ledgerhq/live-common/lib/api/socket'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import { colors } from 'styles/theme'
import uniqueId from 'lodash/uniqueId'
import { openURL } from 'helpers/linking'
import IconCross from 'icons/Cross'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconChevronRight from 'icons/ChevronRight'

import Box from 'components/base/Box'
import { SHOW_MOCK_HSMWARNINGS } from '../config/constants'

const CloseIconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-bottom-left-radius: 4px;
`

const CloseIcon = (props: *) => (
  <CloseIconContainer {...props}>
    <IconCross size={16} color="white" />
  </CloseIconContainer>
)

type Props = {
  t: *,
}

type State = {
  pendingMessages: HSMStatus[],
  dismissedMessages: string[],
}

type HSMStatus = {
  id: string,
  message: string,
}

class HSMStatusBanner extends PureComponent<Props, State> {
  state = {
    pendingMessages: [],
    dismissedMessages: [],
  }

  componentWillMount() {
    if (SHOW_MOCK_HSMWARNINGS) {
      this.setState({
        pendingMessages: [
          {
            id: 'mock1',
            message: 'Lorem Ipsum dolor sit amet #1',
          },
          {
            id: 'mock2',
            message: 'Lorem Ipsum dolor sit amet #2',
          },
        ],
      })
    }

    this.warningSub = warnings.subscribe({
      next: message => {
        this.setState(prevState => ({
          pendingMessages: [...prevState.pendingMessages, { id: uniqueId(), message }],
        }))
      },
    })
  }

  componentWillUnmount() {
    if (this.warningSub) {
      this.warningSub.unsubscribe()
    }
  }

  warningSub = null

  dismiss = item =>
    this.setState(prevState => ({
      dismissedMessages: [...prevState.dismissedMessages, item.id],
    }))

  render() {
    const { t } = this.props
    const { pendingMessages, dismissedMessages } = this.state

    const filtered = pendingMessages.filter(item => dismissedMessages.indexOf(item.id) === -1)

    if (!filtered.length) return null
    return (
      <Box flow={2} style={styles.container}>
        {filtered.map(r => <BannerItem key={r.id} t={t} item={r} onItemDismiss={this.dismiss} />)}
      </Box>
    )
  }
}

class BannerItem extends PureComponent<{
  item: HSMStatus,
  onItemDismiss: HSMStatus => void,
  t: *,
}> {
  onLinkClick = () => openURL('#')
  dismiss = () => this.props.onItemDismiss(this.props.item)

  render() {
    const { item, t } = this.props
    return (
      <Box relative key={item.id} style={styles.banner}>
        <CloseIcon onClick={this.dismiss} />
        <Box horizontal flow={2}>
          <IconExclamationCircle size={16} color="white" />
          <Box shrink ff="Open Sans|SemiBold" style={styles.message}>
            {item.message}
          </Box>
        </Box>
        <BannerItemLink t={t} onClick={this.onLinkClick} />
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
    background: colors.orange,
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: 13,
    paddingTop: 17,
    padding: 15,
    color: 'white',
    fontWeight: 'bold',
    paddingRight: 30,
    width: 350,
  },
  message: {
    marginTop: -3,
  },
}

export default translate()(HSMStatusBanner)
