// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import semver from 'semver'
import network from 'api/network'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Spinner from 'components/base/Spinner'
import GradientBox from 'components/GradientBox'
import TranslatedError from 'components/TranslatedError'
import TrackPage from 'analytics/TrackPage'
import Markdown, { Notes } from 'components/base/Markdown'
import ModalBody from 'components/base/Modal/ModalBody'

import type { T } from 'types/common'

type Props = {
  version: string,
  onClose: () => void,
  t: T,
}

type State = {
  notes: *,
  error: ?Error,
}

const Title = styled(Text).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  color: 'dark',
})``

class ReleaseNotesBody extends PureComponent<Props, State> {
  state = {
    notes: null,
    error: null,
  }

  componentDidMount() {
    const { version } = this.props
    this.fetchNotes(version)
  }

  fetchNotes = async (version: string) => {
    try {
      const { data } = await network({
        method: 'GET',
        url: 'https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases',
        // `https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases/tags/v${version}`,
      })
      const v = semver.parse(version)
      if (!v) throw new Error(`can't parse semver ${version}`)
      const notes = data.filter(
        d =>
          semver.gte(
            d.tag_name,
            v.prerelease.length
              ? `${v.major}.${v.minor}.${v.patch}-${v.prerelease[0]}`
              : `${v.major}.${v.minor}.0`,
          ) && semver.lte(d.tag_name, version),
      )
      this.setState({ notes })
    } catch (error) {
      this.setState({ error })
    }
  }

  renderContent = () => {
    const { error, notes } = this.state
    const { t } = this.props

    const { version } = this.props

    if (notes) {
      return notes.map(note => (
        <Notes mb={6} key={note.tag_name}>
          <Title>{t('releaseNotes.version', { versionNb: note.tag_name })}</Title>
          <Markdown>{note.body}</Markdown>
        </Notes>
      ))
    } else if (error) {
      return (
        <Notes>
          <Title>{t('releaseNotes.version', { versionNb: version })}</Title>
          <Box
            style={{ wordWrap: 'break-word' }}
            color="alertRed"
            ff="Open Sans|SemiBold"
            fontSize={3}
          >
            <TranslatedError error={error} />
          </Box>
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
      <ModalBody
        onClose={onClose}
        title={t('releaseNotes.title')}
        render={() => (
          <Box relative style={{ height: 500 }} px={0} pb={0}>
            <TrackPage category="Modal" name="ReleaseNotes" />
            <Box px={5} pb={8}>
              {this.renderContent()}
            </Box>
            <GradientBox />
          </Box>
        )}
        renderFooter={() => (
          <Box horizontal justifyContent="flex-end">
            <Button onClick={onClose} primary>
              {t('common.continue')}
            </Button>
          </Box>
        )}
      />
    )
  }
}

export default translate()(ReleaseNotesBody)
