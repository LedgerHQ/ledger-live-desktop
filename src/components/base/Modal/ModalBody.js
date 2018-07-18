// @flow

import React, { PureComponent, Fragment } from 'react'
import Animated from 'animated/lib/targets/react-dom'
import { findDOMNode } from 'react-dom'

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

type State = {
  animGradient: Animated.Value,
}

class ModalBody extends PureComponent<Props, State> {
  state = {
    animGradient: new Animated.Value(0),
  }

  componentDidUpdate(prevProps: Props) {
    const shouldFocus = prevProps.refocusWhenChange !== this.props.refocusWhenChange
    if (shouldFocus) {
      if (this._content) {
        const node = findDOMNode(this._content) // eslint-disable-line react/no-find-dom-node
        if (node) {
          // $FlowFixMe
          node.focus()
        }
      }
    }
  }

  _content = null

  animateGradient = (isScrollable: boolean) => {
    const anim = {
      duration: 150,
      toValue: isScrollable ? 1 : 0,
    }
    Animated.timing(this.state.animGradient, anim).start()
  }

  render() {
    const { onBack, onClose, title, render, renderFooter, renderProps, noScroll } = this.props
    const { animGradient } = this.state

    const gradientStyle = {
      ...GRADIENT_STYLE,
      opacity: animGradient,
    }

    return (
      <Fragment>
        <ModalHeader onBack={onBack} onClose={onClose}>
          {title}
        </ModalHeader>
        <ModalContent
          tabIndex={0}
          ref={n => (this._content = n)}
          onIsScrollableChange={this.animateGradient}
          noScroll={noScroll}
        >
          {render && render(renderProps)}
        </ModalContent>
        <div style={GRADIENT_WRAPPER_STYLE}>
          <Animated.div style={gradientStyle} />
        </div>
        {renderFooter && <ModalFooter>{renderFooter(renderProps)}</ModalFooter>}
      </Fragment>
    )
  }
}

const GRADIENT_STYLE = {
  background: 'linear-gradient(rgba(255, 255, 255, 0), #ffffff)',
  height: 40,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 6,
}

const GRADIENT_WRAPPER_STYLE = {
  height: 0,
  position: 'relative',
  pointerEvents: 'none',
}

export default ModalBody
