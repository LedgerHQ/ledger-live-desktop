// @flow

import logger from 'logger'
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { shell, remote } from 'electron'
import qs from 'querystring'

import { rgba } from 'styles/helpers'
import db from 'helpers/db'

import ExportLogsBtn from 'components/ExportLogsBtn'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

type Props = {
  children: any,
}

type State = {
  error: ?Error,
}

const Container = styled(Box).attrs({
  grow: true,
  align: 'center',
  justify: 'center',
  bg: 'lightGraphite',
  color: 'alertRed',
  ff: 'Museo Sans|Bold',
  flow: 2,
})``

const Inner = styled(Box).attrs({
  p: 2,
  bg: p => rgba(p.theme.colors.alertRed, 0.05),
  borderRadius: 1,
})`
  border: ${p => `1px solid ${rgba(p.theme.colors.alertRed, 0.1)}`};
`

class ThrowBlock extends PureComponent<Props, State> {
  state = {
    error: null,
  }

  componentDidCatch(error: Error) {
    logger.error(error)
    this.setState({ error })
  }

  handleCreateIssue = () => {
    const { error } = this.state
    if (!error) {
      return
    }
    const q = qs.stringify({
      title: `Error: ${error.message}`,
      body: `Error was thrown:

\`\`\`
${error.stack}
\`\`\`
`,
    })
    shell.openExternal(`https://github.com/LedgerHQ/ledger-live-desktop/issues/new?${q}`)
  }

  handleRestart = () => {
    remote.app.relaunch()
    remote.app.exit()
  }

  handleReset = () => {
    db.resetAll()
    this.handleRestart()
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <Container>
          <Inner>{`Error: ${error.message}`}</Inner>
          <Box horizontal flow={2}>
            <Button primary onClick={this.handleRestart}>
              {'Restart app'}
            </Button>
            <Button danger onClick={this.handleReset}>
              {'Reset app files'}
            </Button>
            <ExportLogsBtn />
            <Button primary onClick={this.handleCreateIssue}>
              {'Create ticket'}
            </Button>
          </Box>
        </Container>
      )
    }
    return this.props.children
  }
}

export default ThrowBlock
