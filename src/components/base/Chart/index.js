// @flow

import React, { PureComponent } from 'react'
import {
  AreaChart as ReactAreaChart,
  BarChart as ReactBarChart,
  Bar,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

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

export const AreaChart = ({ height, data }: { height: number, data: Array<Object> }) => (
  <Container
    render={({ width }) => (
      <ReactAreaChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5286f7" stopOpacity={0.3} />
            <stop offset="65%" stopColor="#5286f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#d2d3d5"
          tickLine={false}
          interval={2}
          tick={({ x, y, index, payload, visibleTicksCount }) => {
            const { value } = payload

            if (index !== 0 && index !== visibleTicksCount - 1) {
              return (
                <g transform={`translate(${x}, ${y})`}>
                  <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
                    {value}
                  </text>
                </g>
              )
            }

            return null
          }}
        />
        <CartesianGrid vertical={false} strokeDasharray="5" stroke="#d2d3d5" />
        <Tooltip />
        <Area
          animationDuration={ANIMATION_DURATION}
          animationEasing="ease-in-out"
          dataKey="value"
          fill="url(#colorUv)"
          stroke="#5286f7"
          strokeWidth={3}
        />
      </ReactAreaChart>
    )}
  />
)

export const BarChart = ({ height, data }: { height: number, data: Array<Object> }) => (
  <Container
    render={({ width }) => (
      <ReactBarChart width={width} height={height} data={data}>
        <Bar
          animationDuration={ANIMATION_DURATION}
          animationEasing="ease-in-out"
          dataKey="value"
          fill="#8884d8"
        />
      </ReactBarChart>
    )}
  />
)
