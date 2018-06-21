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
  children: any,
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
  children: any,
  render: Function,
  tooltipBg?: string,
}

class Tooltip extends PureComponent<Props> {
  static defaultProps = {
    offset: [0, 0],
  }

  componentDidMount() {
    const { offset, tooltipBg } = this.props

    if (this._node && this._template) {
      tippy(this._node, {
        arrowType: 'round',
        animateFill: false,
        animation: 'shift-toward',
        arrow: true,
        html: this._template,
        offset: offset ? offset.map(v => space[v]).join(',') : 0,
        performance: true,
      })

      // Override default arrow ¯\_(ツ)_/¯
      if (this._node && this._node._tippy) {
        this._node._tippy.popper.querySelector('.tippy-roundarrow').innerHTML = `
          <svg viewBox="0 0 24 8">
            <path${
              tooltipBg ? ` fill="${colors[tooltipBg]}"` : ''
            } d="M5 8l5.5-5.6c.8-.8 2-.8 2.8 0L19 8" />
          </svg>`
      }
    }
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
