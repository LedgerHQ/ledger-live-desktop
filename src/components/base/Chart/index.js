// @flow

import React, { PureComponent } from 'react'
import { AreaChart as ReactAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

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
              {linearGradient.map((g, i) => (
                <stop
                  key={i} // eslint-disable-line react/no-array-index-key
                  offset={`${g[0]}%`}
                  stopColor={color}
                  stopOpacity={g[1]}
                />
              ))}
            </linearGradient>
          </defs>
        )}
        {!tiny && (
          <YAxis
            interval={0}
            dataKey="value"
            tickMargin={0}
            stroke={false}
            tickLine={false}
            tick={({ x, y, index, payload }) => {
              const { value } = payload

              if (index !== 0) {
                return (
                  <g transform={`translate(${x}, ${y})`}>
                    <text x={-30} y={0} dy={5} textAnchor="middle" fill="currentColor">
                      {value}k
                    </text>
                  </g>
                )
              }

              return null
            }}
          />
        )}
        {!tiny && (
          <XAxis
            dataKey="name"
            stroke="#e9eff4"
            tickLine={false}
            interval={2}
            tick={({ x, y, payload }) => {
              const { value } = payload

              return (
                <g transform={`translate(${x}, ${y})`}>
                  <text x={0} y={0} dy={20} textAnchor="middle" fill="currentColor">
                    {value}
                  </text>
                </g>
              )
            }}
          />
        )}
        {!tiny && <CartesianGrid vertical={false} strokeDasharray="5" stroke="#e9eff4" />}
        {!tiny && <Tooltip isAnimationActive={false} />}
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
