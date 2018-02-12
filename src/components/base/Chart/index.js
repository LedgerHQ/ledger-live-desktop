// @flow

import React, { PureComponent } from 'react'
import { AreaChart as ReactAreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts'

import Box from 'components/base/Box'

const ANIMATION_DURATION = 1000

type Props = {
  render: Function,
}

type State = {
  isAnimationActive: boolean,
  width: number,
}

class Container extends PureComponent<Props, State> {
  state = {
    isAnimationActive: true,
    width: 0,
  }

  componentDidMount() {
    this._timeout = setTimeout(
      () =>
        this.setState({
          isAnimationActive: false,
        }),
      ANIMATION_DURATION * 2,
    )

    if (this._node) {
      this._ro = new ResizeObserver(entries => {
        const entry = entries.find(entry => this._node === entry.target)
        if (entry) {
          this.setState({
            width: entry.contentRect.width,
          })
        }
      })

      this._ro.observe(this._node)
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)

    if (this._ro) {
      this._ro.disconnect()
    }
  }

  _ro = undefined
  _node = undefined
  _timeout = undefined

  render() {
    const { render } = this.props
    const { isAnimationActive, width } = this.state
    return <Box innerRef={n => (this._node = n)}>{render({ isAnimationActive, width })}</Box>
  }
}

export const AreaChart = ({
  id,
  linearGradient,
  strokeWidth,
  height,
  color,
  data,
  margin,
  tiny,
}: {
  id: string,
  linearGradient?: Array<Array<*>>,
  strokeWidth?: number,
  height: number,
  color: string,
  data: Array<Object>,
  margin?: Object,
  tiny?: boolean,
}) => (
  <Container
    render={({ width, isAnimationActive }) => (
      <ReactAreaChart width={width} height={height} data={data} margin={margin}>
        {linearGradient && (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              {linearGradient.map(g => (
                <stop offset={`${g[0]}%`} stopColor={color} stopOpacity={g[1]} />
              ))}
            </linearGradient>
          </defs>
        )}
        {!tiny && (
          <XAxis
            dataKey="name"
            stroke="#e9eff4"
            tickLine={false}
            interval={2}
            tick={({ x, y, index, payload, visibleTicksCount }) => {
              const { value } = payload

              if (index !== 0 && index !== visibleTicksCount - 1) {
                return (
                  <g transform={`translate(${x}, ${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fill="currentColor">
                      {value}
                    </text>
                  </g>
                )
              }

              return null
            }}
          />
        )}
        {!tiny && <CartesianGrid vertical={false} strokeDasharray="5" stroke="#e9eff4" />}
        {!tiny && <Tooltip />}
        <Area
          isAnimationActive={isAnimationActive}
          animationDuration={ANIMATION_DURATION}
          animationEasing="ease-in-out"
          dataKey="value"
          fill={`url(#${id})`}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </ReactAreaChart>
    )}
  />
)

AreaChart.defaultProps = {
  linearGradient: [[5, 0.3], [65, 0]],
  margin: undefined,
  strokeWidth: 2,
  tiny: false,
}
