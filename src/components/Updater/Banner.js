// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { radii } from 'styles/theme'

import TranslatedError from 'components/TranslatedError'
import Box from 'components/base/Box'

import { withUpdaterContext } from './UpdaterContext'
import type { UpdaterContextType } from './UpdaterContext'

type Props = {
  context: UpdaterContextType,
}

export const VISIBLE_STATUS = ['download-progress', 'checking', 'check-success', 'error']

class UpdaterTopBanner extends PureComponent<Props> {
  render() {
    const { context } = this.props
    const { status, quitAndInstall, downloadProgress, error } = context

    if (!VISIBLE_STATUS.includes(status)) return null

    return (
      <Container status={status}>
        {status === 'download-progress' && `Downloading update... ${Math.round(downloadProgress)}%`}
        {status === 'checking' && `Verifying update...`}
        {status === 'error' &&
          error && (
            <div>
              {'Error during update. Please download again.'}
              <ErrorContainer>
                <TranslatedError error={error} />
              </ErrorContainer>
            </div>
          )}
        {status === 'check-success' && (
          <div>
            {'Update ready to install. '}
            <DownloadLink onClick={quitAndInstall}>{'install now'}</DownloadLink>
          </div>
        )}
      </Container>
    )
  }
}

const Container = styled(Box).attrs({
  py: '8px',
  px: 3,
  bg: p => (p.status === 'error' ? 'alertRed' : 'wallet'),
  color: 'white',
  mt: -20,
  mb: 20,
  fontSize: 4,
})`
  border-radius: ${radii[1]}px;
`

const DownloadLink = styled.span`
  color: white;
  text-decoration: underline;
  cursor: pointer;
`

const ErrorContainer = styled.div`
  margin-top: 10px;
  font-family: monospace;
  font-size: 10px;
`

export default withUpdaterContext(UpdaterTopBanner)
