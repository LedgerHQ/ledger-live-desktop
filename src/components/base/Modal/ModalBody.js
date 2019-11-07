// @flow

import React, { PureComponent, Fragment } from 'react'

import ModalContent from './ModalContent'
import ModalHeader from './ModalHeader'
import ModalFooter from './ModalFooter'

import type { RenderProps } from './index'

type Props = {
  title: string,
  onBack?: void => void,
  onClose?: void => void,
  render?: (?RenderProps) => any,
  renderFooter?: (?RenderProps) => any,
  renderProps?: RenderProps,
  noScroll?: boolean,
  refocusWhenChange?: any,
}

class ModalBody extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const shouldFocus = prevProps.refocusWhenChange !== this.props.refocusWhenChange
    if (shouldFocus && this._content.current) {
      this._content.current.focus()
    }
  }

  _content = React.createRef()

  render() {
    const { onBack, onClose, title, render, renderFooter, renderProps, noScroll } = this.props

    // For `renderFooter` returning falsy values, we need to resolve first.
    const renderedFooter = renderFooter && renderFooter(renderProps)

    return (
      <Fragment>
        <ModalHeader onBack={onBack} onClose={onClose}>
          {title}
        </ModalHeader>
        <ModalContent tabIndex={0} ref={this._content} noScroll={noScroll}>
          {render && render(renderProps)}
        </ModalContent>
        {renderedFooter && <ModalFooter>{renderedFooter}</ModalFooter>}
      </Fragment>
    )
  }
}

export default ModalBody
