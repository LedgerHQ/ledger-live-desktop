// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { darken, lighten } from 'styles/helpers'

import IconCopy from 'icons/Copy'
import Box from 'components/base/Box'

let clipboard = null

if (!process.env.STORYBOOK_ENV) {
  const electron = require('electron')
  clipboard = electron.clipboard // eslint-disable-line
}

type Props = {
  t: T,
  text: string,
}

type State = {
  isCopied: boolean,
}

class CopyWithFeedback extends PureComponent<Props, State> {
  state = {
    isCopied: false,
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  _isUnmounted = false

  handleCopy = () => {
    const { text } = this.props
    clipboard && clipboard.writeText(text)
    this.setState({ isCopied: true })
    setTimeout(() => {
      this.setState({ isCopied: false })
    }, 1e3)
  }

  render() {
    const { t } = this.props
    const { isCopied } = this.state
    return (
      <ClickableWrapper onClick={this.handleCopy}>
        <IconCopy size={16} />
        <span>{isCopied ? t('common.copied') : t('common.copy')}</span>
      </ClickableWrapper>
    )
  }
}

const ClickableWrapper = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'center',
  flow: 1,
  color: 'wallet',
  fontSize: 4,
  ff: 'Inter|SemiBold',
  cursor: 'default', // this here needs reset because it inherits from cursor: text from parent
}))`
  &:hover {
    color: ${p => lighten(p.theme.colors.wallet, 0.1)};
  }
  &:active {
    color: ${p => darken(p.theme.colors.wallet, 0.1)};
  }
`

export default translate()(CopyWithFeedback)
