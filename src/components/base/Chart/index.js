// @flow

import React, { Fragment, PureComponent } from 'react'
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLabel,
} from 'victory'

import { radii, space, colors, fontSizes } from 'styles/theme'
import { rgba, ff } from 'styles/helpers'

import Box from 'components/base/Box'

const ANIMATION_DURATION = 600

type Props = {
  height: number,
  render: Function,
}

type State = {
  isAnimationActive: boolean,
  width: number,
}

export class WrapperChart extends PureComponent<Props, State> {
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
    const { render, height } = this.props
    const { isAnimationActive, width } = this.state
    return (
      <Box ff="Open Sans" innerRef={n => (this._node = n)} style={{ height }}>
        {render({ isAnimationActive, height, width })}
      </Box>
    )
  }
}

function getLinearGradient({
  linearGradient,
  id,
  color,
}: {
  linearGradient: LinearGradient,
  id: string,
  color: string,
}) {
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="100%">
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
    </svg>
  )
}

type LinearGradient = Array<Array<*>>

type Chart = {
  id: string,
  linearGradient: LinearGradient,
  strokeWidth: number,
  height: number,
  padding?: Object | number,
  color: string,
  data: Array<Object>,
}

export const SimpleAreaChart = ({
  linearGradient,
  height,
  data,
  strokeWidth,
  id,
  padding,
  color,
}: Chart) => (
  <WrapperChart
    height={height}
    render={({ width, isAnimationActive }) => (
      <Fragment>
        {getLinearGradient({
          linearGradient,
          id,
          color,
        })}
        <VictoryArea
          animate={isAnimationActive ? { duration: ANIMATION_DURATION } : null}
          data={data}
          x="name"
          y="value"
          style={{
            data: {
              stroke: color,
              fill: `url(#${id})`,
              strokeWidth,
            },
          }}
          padding={padding}
          height={height}
          width={width}
        />
      </Fragment>
    )}
  />
)

SimpleAreaChart.defaultProps = {
  padding: 0,
}

export const AreaChart = ({
  strokeWidth,
  id,
  color,
  linearGradient,
  padding,
  height,
  data,
}: Chart) => {
  const tickLabelsStyle = {
    fill: colors.grey,
    fontSize: fontSizes[4],
    fontFamily: 'inherit',
    fontWeight: 'inherit',
  }

  return (
    <WrapperChart
      height={height}
      render={({ width, isAnimationActive }) => (
        <Fragment>
          {getLinearGradient({
            linearGradient,
            id,
            color,
          })}
          <VictoryChart
            height={height}
            width={width}
            padding={padding}
            containerComponent={<VictoryVoronoiContainer voronoiDimension="x" />}
          >
            <VictoryAxis
              tickCount={6}
              style={{
                axis: {
                  stroke: colors.lightGrey,
                },
                tickLabels: {
                  ...tickLabelsStyle,
                  padding: space[2],
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickCount={4}
              style={{
                grid: {
                  stroke: colors.lightGrey,
                  strokeDasharray: 5,
                },
                axis: {
                  stroke: null,
                },
                tickLabels: {
                  ...tickLabelsStyle,
                  padding: space[4],
                },
              }}
            />
            <VictoryArea
              animate={isAnimationActive ? { duration: ANIMATION_DURATION } : null}
              data={data}
              x="name"
              y="value"
              labelComponent={
                <VictoryTooltip
                  corderRadius={radii[1]}
                  pointerLength={0}
                  height={25}
                  labelComponent={
                    <VictoryLabel
                      style={{
                        ...ff('Open Sans|SemiBold'),
                        fontSize: fontSizes[2],
                        fill: colors.white,
                      }}
                    />
                  }
                  flyoutStyle={{
                    fill: rgba(colors.dark, 0.8),
                    stroke: null,
                  }}
                  width={a => space[1] * 2 + a.value.length}
                />
              }
              labels={d => d.y}
              style={{
                data: {
                  stroke: color,
                  fill: `url(#${id})`,
                  strokeWidth,
                },
              }}
              width={width}
            />
          </VictoryChart>
        </Fragment>
      )}
    />
  )
}

AreaChart.defaultProps = {
  linearGradient: [[5, 0.2], [50, 0]],
  padding: undefined,
}
