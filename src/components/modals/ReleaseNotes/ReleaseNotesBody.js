// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import network from 'api/network'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Text from 'components/base/Text'
import Spinner from 'components/base/Spinner'
import GradientBox from 'components/GradientBox'
import TrackPage from 'analytics/TrackPage'
import Markdow, { Notes } from 'components/base/Markdown'
import { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'

import type { T } from 'types/common'

type Props = {
  version: string,
  onClose: () => void,
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

class ReleaseNotesBody extends PureComponent<Props, State> {
  state = {
    markdown: null,
  }

  componentDidMount() {
    const { version } = this.props
    this.fetchNotes(version)
  }

  fetchNotes = async (version: string) => {
    try {
      const {
        data: { body },
      } = await network({
        method: 'GET',
        url: `https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases/tags/v${version}`,
      })
      if (body) {
        this.setState({ markdown: body })
      } else {
        this.setState({ markdown: this.props.t('app:common.error.load') })
      }
    } catch (error) {
      this.setState({ markdown: this.props.t('app:common.error.load') })
    }
  }

  renderContent = () => {
    const { markdown } = this.state
    const { t } = this.props

    const { version } = this.props

    if (markdown) {
      return (
        <Notes>
          <Title>{t('app:releaseNotes.version', { versionNb: version })}</Title>
          <Markdow>{markdown}</Markdow>
        </Notes>
      )
    }

    return (
      <Box horizontal alignItems="center">
        <Spinner
          size={32}
          style={{
            margin: 'auto',
          }}
        />
      </Box>
    )
  }

  render() {
    const { onClose, t } = this.props

    return (
      <ModalBody onClose={onClose}>
        <TrackPage category="Modal" name="ReleaseNotes" />
        <ModalTitle>{t('app:releaseNotes.title')}</ModalTitle>
        <ModalContent relative style={{ height: 500 }} px={0} pb={0}>
          <GrowScroll px={5} pb={8}>
            {this.renderContent()}
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
}

export default translate()(ReleaseNotesBody)
