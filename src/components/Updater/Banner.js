// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

import { urls } from 'config/urls'
import { radii } from 'styles/theme'
import { openURL } from 'helpers/linking'

import Spinner from 'components/base/Spinner'
import Box from 'components/base/Box'
import IconUpdate from 'icons/Update'
import IconDonjon from 'icons/Donjon'
import IconWarning from 'icons/TriangleWarning'

import { withUpdaterContext } from './UpdaterContext'
import type { UpdaterContextType } from './UpdaterContext'

type Props = {
  context: UpdaterContextType,
}

export const VISIBLE_STATUS = ['download-progress', 'checking', 'check-success', 'error']

type Content = {
  Icon: React$ComponentType<*>,
  message: React$Node,
  Right?: React$ComponentType<*>,
}

type RightProps = {
  downloadProgress: number, // eslint-disable-line react/no-unused-prop-types
  quitAndInstall: () => void, // eslint-disable-line react/no-unused-prop-types
  reDownload: () => void, // eslint-disable-line react/no-unused-prop-types
}

const CONTENT_BY_STATUS: { [_: string]: Content } = {
  'download-progress': {
    Icon: Spinner,
    message: <Trans i18nKey="update.downloadInProgress" />,
    Right: ({ downloadProgress }: RightProps) => (
      <Trans i18nKey="update.downloadProgress" values={{ progress: downloadProgress }} />
    ),
  },
  checking: {
    Icon: IconDonjon,
    message: <Trans i18nKey="update.checking" />,
  },
  'check-success': {
    Icon: IconUpdate,
    message: <Trans i18nKey="update.checkSuccess" />,
    Right: ({ quitAndInstall }: RightProps) => (
      <FakeLink onClick={quitAndInstall}>
        <Trans i18nKey="update.quitAndInstall" />
      </FakeLink>
    ),
  },
  error: {
    Icon: IconWarning,
    message: <Trans i18nKey="update.error" />,
    Right: ({ reDownload }: RightProps) => (
      <FakeLink onClick={reDownload}>
        <Trans i18nKey="update.reDownload" />
      </FakeLink>
    ),
  },
}

class UpdaterTopBanner extends PureComponent<Props> {
  reDownload = () => {
    openURL(urls.liveHome)
  }

  render() {
    const { context } = this.props
    const { status, quitAndInstall, downloadProgress } = context

    if (!VISIBLE_STATUS.includes(status)) return null

    const content: ?Content = CONTENT_BY_STATUS[status]
    if (!content) return null

    const { Icon, message, Right } = content

    return (
      <Container status={status}>
        {Icon && (
          <IconContainer>
            {/* $FlowFixMe let me do my stuff, flow */}
            <Icon size={16} />
          </IconContainer>
        )}
        {message}
        {Right && (
          <RightContainer>
            <Right
              downloadProgress={downloadProgress}
              quitAndInstall={quitAndInstall}
              reDownload={this.reDownload}
            />
          </RightContainer>
        )}
      </Container>
    )
  }
}

const IconContainer = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
`

const Container = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  py: '8px',
  px: 3,
  bg: p => (p.status === 'error' ? 'alertRed' : 'wallet'),
  color: 'white',
  mt: -20,
  mb: 20,
  fontSize: 4,
  ff: 'Open Sans|SemiBold',
})`
  border-radius: ${radii[1]}px;
`

const FakeLink = styled.span`
  color: white;
  text-decoration: underline;
  cursor: pointer;
`

const RightContainer = styled.div`
  margin-left: auto;
`

export default withUpdaterContext(UpdaterTopBanner)
