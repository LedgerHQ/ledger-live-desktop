// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import type { Location } from 'react-router'
import type { T } from 'types/common'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { MODAL_RECEIVE, MODAL_SEND, MAIN_SIDEBAR_WIDTH } from 'config/constants'
import { accountsSelector, starredAccountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'
import { developerModeSelector, sidebarCollapsedSelector } from 'reducers/settings'
import { setSidebarCollapsed } from 'actions/settings'

import { SideBarList, SideBarListItem } from 'components/base/SideBar'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import UpdateDot from 'components/Updater/UpdateDot'
import IconManager from 'icons/Manager'
import IconWallet from 'icons/Wallet'
import IconPortfolio from 'icons/Portfolio'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'
import IconChevron from 'icons/ChevronRight'
import TopGradient from './TopGradient'
import useExperimental from '../../hooks/useExperimental'
import { darken, rgba } from '../../styles/helpers'
import Stars from '../Stars'

const mapStateToProps = state => ({
  noAccounts: accountsSelector(state).length === 0,
  hasStarredAccounts: starredAccountsSelector(state).length > 0,
  developerMode: developerModeSelector(state),
  collapsed: sidebarCollapsedSelector(state),
})

const mapDispatchToProps = {
  push,
  openModal,
  setCollapsed: setSidebarCollapsed,
}

type Props = {
  t: T,
  noAccounts: boolean,
  hasStarredAccounts: boolean,
  location: Location,
  push: string => void,
  openModal: string => void,
  collapsed: boolean,
  setCollapsed: boolean => void,
}

const TagContainer = () => {
  const isExperimental = useExperimental()

  return isExperimental ? (
    <Box
      justifyContent="center"
      m={2}
      style={{
        flexGrow: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',
      }}
    >
      <Tag to="/settings/experimental">
        <Trans i18nKey="common.experimentalFeature" />
      </Tag>
    </Box>
  ) : null
}

const Tag = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans';
  font-weight: bold;
  font-size: 10px;
  padding: 2px 8px;
  min-height: 22px;
  border-radius: 4px;
  color: ${p => p.theme.colors.smoke};
  background-color: ${p => p.theme.colors.lightFog};
  text-decoration: none;

  &:hover {
    background-color: ${p => darken(p.theme.colors.lightFog, 0.05)};
  }
`

const collapserSize = 24
const collapsedWidth = 15 * 4 + 16 // 15 * 4 margins + 16 icon size

const Collapser = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  position: absolute;
  top: ${58 - collapserSize / 2}px;
  left: ${p => (p.collapsed ? collapsedWidth : MAIN_SIDEBAR_WIDTH) - collapserSize / 2}px;

  width: ${collapserSize}px;
  height: ${collapserSize}px;

  cursor: pointer;
  border-radius: 50%;
  background: ${p => p.theme.colors.white};
  color: ${p => p.theme.colors.grey};
  border-color: ${p => p.theme.colors.fog};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid;
  transition: all 0.5s;
  z-index: 100;

  &:hover {
    border-color: ${p => p.theme.colors.wallet};
    color: ${p => p.theme.colors.wallet};
    background: ${p => rgba(p.theme.colors.wallet, 0.1)};
  }

  & > * {
    transform: ${p => (p.collapsed ? '' : 'rotate(180deg)')};
    margin-left: ${p => (p.collapsed ? '' : '-2px')};

    transition: transform 0.5s;
  }
`

const Separator = styled(Box).attrs({
  mx: 4,
})`
  height: 1px;
  background: ${p => p.theme.colors.fog};
`

export const Hide = styled.div`
  pointer-events: ${p => (p.visible ? '' : 'none')};
  opacity: ${p => (p.visible ? 1 : 0)};
  transition: opacity 0.15s;
  overflow: hidden;
`

const SideBar = styled(Box).attrs({
  relative: true,
})`
  background-color: ${p => p.theme.colors.white};
  width: ${p => (p.collapsed ? collapsedWidth : MAIN_SIDEBAR_WIDTH)}px;
  transition: width 0.5s;
  will-change: width;
  transform: translate3d(0, 0, 10);

  & > ${Collapser} {
    opacity: 0;
  }

  &:hover {
    > ${Collapser} {
      opacity: 1;
    }
  }
`

class MainSideBar extends PureComponent<Props> {
  handleCollapse = () => {
    const { setCollapsed, collapsed } = this.props

    setCollapsed(!collapsed)
  }

  push = (to: string) => {
    const { push } = this.props
    const {
      location: { pathname },
    } = this.props
    if (pathname === to) {
      return
    }
    push(to)
  }

  handleClickDashboard = () => this.push('/')
  handleOpenSendModal = () => {
    this.maybeRedirectToAccounts()
    this.props.openModal(MODAL_SEND)
  }
  handleOpenReceiveModal = () => {
    this.maybeRedirectToAccounts()
    this.props.openModal(MODAL_RECEIVE)
  }
  handleClickManager = () => this.push('/manager')
  handleClickAccounts = () => this.push('/accounts')
  handleClickExchange = () => this.push('/partners')
  handleClickDev = () => this.push('/dev')
  maybeRedirectToAccounts = () => {
    this.props.location.pathname === '/manager' && this.push('/accounts')
  }

  render() {
    const { t, noAccounts, hasStarredAccounts, location, collapsed } = this.props
    const { pathname } = location

    return (
      <SideBar collapsed={collapsed}>
        <Collapser collapsed={collapsed} onClick={this.handleCollapse}>
          <IconChevron size={16} />
        </Collapser>
        <TopGradient />
        <Space of={70} />
        <SideBarList title={t('sidebar.menu')} collapsed={collapsed}>
          <SideBarListItem
            label={t('dashboard.title')}
            icon={IconPortfolio}
            iconActiveColor="wallet"
            onClick={this.handleClickDashboard}
            isActive={pathname === '/'}
            NotifComponent={noAccounts ? undefined : UpdateDot}
            disabled={noAccounts}
            showTooltip={collapsed}
          />
          <SideBarListItem
            label={t('sidebar.accounts')}
            icon={IconWallet}
            iconActiveColor="wallet"
            isActive={pathname === '/accounts'}
            onClick={this.handleClickAccounts}
            NotifComponent={noAccounts ? UpdateDot : undefined}
            showTooltip={collapsed}
          />
          <SideBarListItem
            label={t('send.title')}
            icon={IconSend}
            iconActiveColor="wallet"
            onClick={this.handleOpenSendModal}
            disabled={noAccounts}
            showTooltip={collapsed}
          />
          <SideBarListItem
            label={t('receive.title')}
            icon={IconReceive}
            iconActiveColor="wallet"
            onClick={this.handleOpenReceiveModal}
            disabled={noAccounts}
            showTooltip={collapsed}
          />
          <SideBarListItem
            label={t('sidebar.manager')}
            icon={IconManager}
            iconActiveColor="wallet"
            onClick={this.handleClickManager}
            isActive={pathname === '/manager'}
            showTooltip={collapsed}
          />
          <SideBarListItem
            label={t('sidebar.exchange')}
            icon={IconExchange}
            iconActiveColor="wallet"
            onClick={this.handleClickExchange}
            isActive={pathname === '/partners'}
            showTooltip={collapsed}
          />
          <Space of={30} />
        </SideBarList>

        <Hide visible={collapsed && hasStarredAccounts} style={{ marginBottom: -8 }}>
          <Separator />
        </Hide>

        <SideBarList scroll title={t('sidebar.stars')} collapsed={collapsed}>
          <Stars pathname={pathname} collapsed={collapsed} />

          <Hide visible={!collapsed}>
            <TagContainer />
          </Hide>
        </SideBarList>
      </SideBar>
    )
  }
}

const decorate = compose(
  // $FlowFixMe
  withRouter,
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)
export default decorate(MainSideBar)
