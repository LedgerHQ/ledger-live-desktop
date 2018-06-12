// @flow
import React, { PureComponent } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

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

class ReleaseNotes extends PureComponent<*, *> {
  render() {
    const renderBody = ({ data, onClose }) => {
      const { name, body: markdown } = data

      return (
        <ModalBody onClose={onClose}>
          <ModalTitle>Release Notes</ModalTitle>
          <ModalContent>
            <Notes>
              <Title>Version {name}</Title>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </Notes>
          </ModalContent>
        </ModalBody>
      )
    }

    return <Modal name={MODAL_RELEASES_NOTES} render={renderBody} />
  }
}

export default ReleaseNotes
