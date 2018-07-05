// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import network from 'api/network'

import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Text from 'components/base/Text'
import Spinner from 'components/base/Spinner'
import GradientBox from 'components/GradientBox'
import TrackPage from 'analytics/TrackPage'
import Markdow, { Notes } from 'components/base/Markdown'

import type { T } from 'types/common'

type Props = {
  t: T,
}

type State = {
  markdown: ?string,
}

const Title = styled(Text).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  color: 'dark',
})``

class ReleaseNotes extends PureComponent<Props, State> {
  state = {
    markdown: null,
  }

  loading = false

  fetchNotes = version => {
    if (!this.loading) {
      this.loading = true

      network({
        method: 'GET',
        url: `https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases/tags/v${version}`,
      })
        .then(response => {
          const { body } = response.data

          this.setState(
            {
              markdown: body,
            },
            () => {
              this.loading = false
            },
          )
        })
        .catch(() => {
          this.setState(
            {
              markdown: this.props.t('app:common.error.load'),
            },
            () => {
              this.loading = false
            },
          )
        })
    }
  }

  render() {
    const { t } = this.props
    const renderBody = ({ data, onClose }) => {
      const version = data
      const { markdown } = this.state
      let content

      if (markdown === null) {
        this.fetchNotes(version)

        content = (
          <Box horizontal alignItems="center">
            <Spinner
              size={32}
              style={{
                margin: 'auto',
              }}
            />
          </Box>
        )
      } else {
        content = (
          <Notes>
            <Title>{t('app:releaseNotes.version', { versionNb: version })}</Title>
            <Markdow>{markdown}</Markdow>
          </Notes>
        )
      }

      return (
        <ModalBody onClose={onClose}>
          <TrackPage category="Modal" name="ReleaseNotes" />
          <ModalTitle>{t('app:releaseNotes.title')}</ModalTitle>
          <ModalContent relative style={{ height: 500 }} px={0} pb={0}>
            <GrowScroll px={5} pb={8}>
              {content}
            </GrowScroll>
            <GradientBox />
          </ModalContent>
          <ModalFooter horizontal justifyContent="flex-end">
            <Button onClick={onClose} primary>
              {t('app:common.continue')}
            </Button>
          </ModalFooter>
        </ModalBody>
      )
    }

    return <Modal name={MODAL_RELEASES_NOTES} render={renderBody} />
  }
}

export default translate()(ReleaseNotes)
