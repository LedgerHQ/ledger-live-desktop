// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import tippy from 'tippy.js'

import { space, colors } from 'styles/theme'

import Box from 'components/base/Box'

const Container = styled(Box)`
  display: inline-flex;
`

const Template = styled.div`
  display: none;
`

export const TooltipContainer = ({
  children,
  innerRef,
  style,
  tooltipBg,
}: {
  children: React$Node,
  innerRef?: Function,
  style?: Object,
  tooltipBg?: string,
}) => (
  <div
    ref={innerRef}
    style={{
      background: colors[tooltipBg || 'dark'],
      borderRadius: 4,
      color: 'white',
      fontFamily: 'Open Sans',
      fontWeight: 600,
      fontSize: 10,
      padding: '5px 10px 5px 10px',
      ...style,
    }}
  >
    {children}
  </div>
)

TooltipContainer.defaultProps = {
  innerRef: undefined,
  style: undefined,
}

type Props = {
  offset?: Array<number>,
  children: React$Node,
  enabled?: boolean,
  render: Function,
  tooltipBg?: string,
  options?: { [string]: any },
}

export const replaceTippyArrow = (_tippy: any, tooltipBg?: string) => {
  _tippy.popper.querySelector('.tippy-roundarrow').innerHTML = `
    <svg viewBox="0 0 24 8">
      <path${
        tooltipBg ? ` fill="${colors[tooltipBg]}"` : ''
      } d="M5 8l5.5-5.6c.8-.8 2-.8 2.8 0L19 8" />
    </svg>`
}

export const defaultTippyOptions = {
  arrowType: 'round',
  animateFill: false,
  animation: 'shift-toward',
  arrow: true,
  offset: 0,
  performance: true,
}

class Tooltip extends PureComponent<Props> {
  static defaultProps = {
    offset: [0, 0],
    enabled: true,
  }

  componentDidMount() {
    const { offset, tooltipBg, enabled, options } = this.props

    if (this._node && this._template) {
      tippy(this._node, {
        ...defaultTippyOptions,
        html: this._template,
        offset: offset ? offset.map(v => space[v]).join(',') : 0,
        ...options,
      })

      const _tippy = this._node && this._node._tippy

      // make flow happy
      if (!_tippy) return

      // Override default arrow ¯\_(ツ)_/¯
      replaceTippyArrow(_tippy, tooltipBg)

      // disable tooltip if needed
      if (!enabled) {
        _tippy.disable()
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const _tippy = this._node && this._node._tippy

    if (!_tippy) return

    // handle dynamically updating enabled state
    if (prevProps.enabled && !this.props.enabled) {
      _tippy.disable()
      _tippy.hide()
    } else if (!prevProps.enabled && this.props.enabled) {
      _tippy.enable()
    }
  }

  componentWillUnmount() {
    const _tippy = this._node && this._node._tippy

    if (!_tippy) return

    _tippy.destroy()
  }

  _node = undefined
  _template = undefined

  render() {
    const { children, render, tooltipBg, ...props } = this.props

    return (
      <Container innerRef={n => (this._node = n)} {...props}>
        <Template>
          <TooltipContainer tooltipBg={tooltipBg} innerRef={n => (this._template = n)}>
            {render()}
          </TooltipContainer>
        </Template>
        {children}
      </Container>
    )
  }
}

export default Tooltip
