// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import axios from 'axios'

import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Spinner from 'components/base/Spinner'

import type { T } from 'types/common'

type Props = {
  t: T,
}

type State = {
  markdown: ?string,
  loading: boolean,
}

const Notes = styled(Box).attrs({
  ff: 'Open Sans',
  fontSize: 4,
  color: 'smoke',
  flow: 4,
})`
  ul,
  ol {
    padding-left: 20px;
  }

  p {
    margin: 1em 0;
  }

  code,
  pre {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }

  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
    background-color: ${p => p.theme.colors.lightGrey};
    border-radius: 3px;
  }

  pre {
    word-wrap: normal;

    code {
      word-break: normal;
      white-space: pre;
      background: transparent;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${p => p.theme.colors.dark};
    font-weight: bold;
    margin-top: 24px;
    margin-bottom: 16px;
  }

  h1 {
    padding-bottom: 0.3em;
    font-size: 1.33em;
  }

  h2 {
    padding-bottom: 0.3em;
    font-size: 1.25em;
  }

  h3 {
    font-size: 1em;
  }

  h4 {
    font-size: 0.875em;
  }

  h5,
  h6 {
    font-size: 0.85em;
    color: #6a737d;
  }

  img {
    max-width: 100%;
  }

  hr {
    height: 1px;
    border: none;
    background-color: ${p => p.theme.colors.fog};
  }

  blockquote {
    padding: 0 1em;
    border-left: 0.25em solid #dfe2e5;
  }

  table {
    width: 100%;
    overflow: auto;
    border-collapse: collapse;

    th {
      font-weight: bold;
    }

    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }

    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }

  input[type='checkbox'] {
    margin-right: 0.5em;
  }
`

const Title = styled(Text).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  color: 'dark',
})``

class ReleaseNotes extends PureComponent<Props, State> {
  state = {
    markdown: null,
    loading: false,
  }

  fetchNotes = version => {
    if (!this.state.loading) {
      this.setState({
        loading: true,
      })

      axios
        .get(`https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases/tags/v${version}`)
        .then(response => {
          const { body } = response.data

          this.setState({
            markdown: body,
            loading: false,
          })
        })
    }
  }

  render() {
    const { t } = this.props
    const renderBody = ({ data, onClose }) => {
      const version = data
      const { markdown } = this.state
      let content

      if (!markdown) {
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
            <Title>{t('releaseNotes:version', { versionNb: version })}</Title>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </Notes>
        )
      }

      return (
        <ModalBody onClose={onClose}>
          <ModalTitle>{t('releaseNotes:title')}</ModalTitle>
          <ModalContent>{content}</ModalContent>
          <ModalFooter horizontal justifyContent="flex-end">
            <Button onClick={onClose} primary>
              {t('common:continue')}
            </Button>
          </ModalFooter>
        </ModalBody>
      )
    }

    return <Modal name={MODAL_RELEASES_NOTES} render={renderBody} />
  }
}

export default translate()(ReleaseNotes)
