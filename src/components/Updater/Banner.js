// @flow

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'

import { urls } from 'config/urls'
import { openURL } from 'helpers/linking'

import Spinner from 'components/base/Spinner'
import IconUpdate from 'icons/Update'
import IconDonjon from 'icons/Donjon'
import IconWarning from 'icons/TriangleWarning'

import { withUpdaterContext } from './UpdaterContext'
import type { UpdaterContextType } from './UpdaterContext'
import TopBanner, { FakeLink } from '../TopBanner'
import type { Content } from '../TopBanner'

type Props = {
  context: UpdaterContextType,
}

export const VISIBLE_STATUS = ['download-progress', 'checking', 'check-success', 'error']

const CONTENT_BY_STATUS = (quitAndInstall, reDownload, progress): { [string]: Content } => ({
  'download-progress': {
    Icon: Spinner,
    message: <Trans i18nKey="update.downloadInProgress" />,
    right: <Trans i18nKey="update.downloadProgress" values={{ progress }} />,
  },
  checking: {
    Icon: IconDonjon,
    message: <Trans i18nKey="update.checking" />,
  },
  'check-success': {
    Icon: IconUpdate,
    message: <Trans i18nKey="update.checkSuccess" />,
    right: (
      <FakeLink onClick={quitAndInstall}>
        <Trans i18nKey="update.quitAndInstall" />
      </FakeLink>
    ),
  },
  error: {
    Icon: IconWarning,
    message: <Trans i18nKey="update.error" />,
    right: (
      <FakeLink onClick={reDownload}>
        <Trans i18nKey="update.reDownload" />
      </FakeLink>
    ),
  },
})

class UpdaterTopBanner extends PureComponent<Props> {
  reDownload = () => {
    openURL(urls.liveHome)
  }

  render() {
    const { context } = this.props
    const { status, quitAndInstall, downloadProgress } = context
    if (!VISIBLE_STATUS.includes(status)) return null

    const content: ?Content = CONTENT_BY_STATUS(quitAndInstall, this.reDownload, downloadProgress)[
      status
    ]
    if (!content) return null

    return <TopBanner content={content} status={status} />
  }
}

export default withUpdaterContext(UpdaterTopBanner)
