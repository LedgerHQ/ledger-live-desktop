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
import { Transition } from 'react-transition-group'

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
import ExperimentalIcon from '../../icons/Experimental'

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

const TagText = styled.div`
  margin-left: 8px;
`

const hideTransitionDuration = 200

const hideTransitionStyles = {
  entering: {
    opacity: 1,
    transition: `opacity ${hideTransitionDuration}ms`,
  },
  entered: {
    opacity: 1,
  },
  exiting: {
    opacity: 0,
    transition: `opacity ${hideTransitionDuration}ms`,
  },
  exited: {
    opacity: 0,
    width: 0,
  },
}

const HideContainer = styled.div`
  overflow: hidden;
`

export const Hide = ({ visible, children }: { visible: boolean, children: any }) => (
  <Transition in={visible} timeout={hideTransitionDuration}>
    {state => <HideContainer style={hideTransitionStyles[state]}>{children}</HideContainer>}
  </Transition>
)

const TagContainer = ({ collapsed }: { collapsed: boolean }) => {
  const isExperimental = useExperimental()

  return isExperimental ? (
    <Box
      justifyContent="center"
      m={2}
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <Tag to="/settings/experimental">
        <ExperimentalIcon width={16} height={16} />
        <Hide visible={collapsed}>
          <TagText>
            <Trans i18nKey="common.experimentalFeature" />
          </TagText>
        </Hide>
      </Tag>
    </Box>
  ) : null
}

const Tag = styled(Link)`
  display: flex;
  justify-self: flex-end;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  font-weight: bold;
  font-size: 10px;
  padding: 2px 8px;
  min-height: 32px;
  border-radius: 4px;
  color: ${p => p.theme.colors.palette.text.shade100};
  background-color: ${p => p.theme.colors.palette.background.default};
  text-decoration: none;

  &:hover {
    background-color: ${p => darken(p.theme.colors.palette.action.hover, 0.05)};
    border: solid 1px ${p => p.theme.colors.wallet};
  }
`

const collapserSize = 24
const collapsedWidth = 15 * 4 + 16 // 15 * 4 margins + 16 icon size

const Collapser = styled(Box).attrs(() => ({
  alignItems: 'center',
  justifyContent: 'center',
}))`
  position: absolute;
  top: ${58 - collapserSize / 2}px;
  left: ${p => (p.collapsed ? collapsedWidth : MAIN_SIDEBAR_WIDTH) - collapserSize / 2}px;

  width: ${collapserSize}px;
  height: ${collapserSize}px;

  cursor: pointer;
  border-radius: 50%;
  background: ${p => p.theme.colors.palette.background.paper};
  color: ${p => p.theme.colors.palette.text.shade80};
  border-color: ${p => p.theme.colors.palette.divider};
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

const Separator = styled(Box).attrs(() => ({
  mx: 4,
}))`
  height: 1px;
  background: ${p => p.theme.colors.palette.divider};
`

const sideBarTransitionStyles = {
  entering: { width: MAIN_SIDEBAR_WIDTH },
  entered: { width: MAIN_SIDEBAR_WIDTH },
  exiting: { width: collapsedWidth },
  exited: { width: collapsedWidth },
}

const enableTransitions = () =>
  document.body &&
  setTimeout(
    () => document.body && document.body.classList.remove('stop-container-transition'),
    500,
  )
const disableTransitions = () =>
  document.body && document.body.classList.add('stop-container-transition')

const sideBarTransitionSpeed = 500

const SideBar = styled(Box).attrs(() => ({
  relative: true,
}))`
  background-color: ${p => p.theme.colors.palette.background.paper};
  transition: width ${sideBarTransitionSpeed}ms;
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
      <Transition
        in={!collapsed}
        timeout={sideBarTransitionSpeed}
        onEnter={disableTransitions}
        onExit={disableTransitions}
        onEntered={enableTransitions}
        onExited={enableTransitions}
      >
        {state => {
          const secondAnim = !(state === 'entered' && !collapsed)
          return (
            <SideBar className="unstoppableAnimation" style={sideBarTransitionStyles[state]}>
              <Collapser collapsed={collapsed} onClick={this.handleCollapse}>
                <IconChevron size={16} />
              </Collapser>
              <TopGradient />
              <Space of={70} />
              <SideBarList title={t('sidebar.menu')} collapsed={secondAnim}>
                <SideBarListItem
                  label={t('dashboard.title')}
                  icon={IconPortfolio}
                  iconActiveColor="wallet"
                  onClick={this.handleClickDashboard}
                  isActive={pathname === '/'}
                  NotifComponent={noAccounts ? undefined : UpdateDot}
                  disabled={noAccounts}
                  collapsed={secondAnim}
                />
                <SideBarListItem
                  label={t('sidebar.accounts')}
                  icon={IconWallet}
                  iconActiveColor="wallet"
                  isActive={pathname === '/accounts'}
                  onClick={this.handleClickAccounts}
                  NotifComponent={noAccounts ? UpdateDot : undefined}
                  collapsed={secondAnim}
                />
                <SideBarListItem
                  label={t('send.title')}
                  icon={IconSend}
                  iconActiveColor="wallet"
                  onClick={this.handleOpenSendModal}
                  disabled={noAccounts}
                  collapsed={secondAnim}
                />
                <SideBarListItem
                  label={t('receive.title')}
                  icon={IconReceive}
                  iconActiveColor="wallet"
                  onClick={this.handleOpenReceiveModal}
                  disabled={noAccounts}
                  collapsed={secondAnim}
                />
                <SideBarListItem
                  label={t('sidebar.manager')}
                  icon={IconManager}
                  iconActiveColor="wallet"
                  onClick={this.handleClickManager}
                  isActive={pathname === '/manager'}
                  collapsed={secondAnim}
                />
                <SideBarListItem
                  label={t('sidebar.exchange')}
                  icon={IconExchange}
                  iconActiveColor="wallet"
                  onClick={this.handleClickExchange}
                  isActive={pathname === '/partners'}
                  collapsed={secondAnim}
                />
                <Space of={30} />
              </SideBarList>

              <Hide visible={secondAnim && hasStarredAccounts} style={{ marginBottom: -8 }}>
                <Separator />
              </Hide>

              <SideBarList scroll title={t('sidebar.stars')} collapsed={secondAnim}>
                <Stars pathname={pathname} collapsed={secondAnim} />
              </SideBarList>
              <TagContainer collapsed={!secondAnim} />
            </SideBar>
          )
        }}
      </Transition>
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
