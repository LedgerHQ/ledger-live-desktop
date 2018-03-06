// @flow

/* eslint-disable react/no-multi-comp */

import React, { Fragment, Component, PureComponent } from 'react'
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'

import { space, colors, fontSizes } from 'styles/theme'

import Box from 'components/base/Box'
import { TooltipContainer } from 'components/base/Tooltip'

const ANIMATION_DURATION = 600
const DEFAULT_PROPS = {
  color: 'blue',
  padding: 0,
}

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
  return linearGradient.length > 0 ? (
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
  ) : null
}

class CustomTooltip extends Component<Object> {
  static defaultEvents = VictoryTooltip.defaultEvents

  shouldComponentUpdate(nextProps) {
    const isActive = nextProps.active === true
    const wasActive = this.props.active === true && !nextProps.active

    return isActive || wasActive
  }

  render() {
    const { x, y, active, text, datum } = this.props

    if (!active) {
      return null
    }

    return (
      <foreignObject>
        <TooltipContainer
          mt={-space[1]}
          style={{ position: 'absolute', top: y, left: x, transform: `translate3d(-50%, 0, 0)` }}
        >
          {text(datum)}
        </TooltipContainer>
      </foreignObject>
    )
  }
}

type LinearGradient = Array<Array<*>>

type GenericChart = {
  id: string,
  linearGradient: LinearGradient,
  strokeWidth: number,
  height: number,
  padding: Object | number,
  color: string,
  data: Array<Object>,
}
type Chart = GenericChart & {
  renderLabels: Function,
  renderTickX: Function,
  renderTickY: Function,
  tickCountX: number,
  tickCountY: number,
}

export const SimpleAreaChart = ({
  linearGradient,
  height,
  data,
  strokeWidth,
  id,
  padding,
  color,
}: GenericChart) => (
  <WrapperChart
    height={height}
    render={({ width }) => (
      <Fragment>
        {getLinearGradient({
          linearGradient,
          id,
          color,
        })}
        <VictoryArea
          domainPadding={{
            y: [0, space[1]],
          }}
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
  height: 50,
  id: 'simple-chart',
  linearGradient: [],
  strokeWidth: 1,
  ...DEFAULT_PROPS,
}

const areaChartTooltip = <CustomTooltip />

const AreaChartContainer = <VictoryVoronoiContainer voronoiDimension="x" />

export class AreaChart extends PureComponent<Chart> {
  static defaultProps = {
    height: 100,
    id: 'chart',
    linearGradient: [[5, 0.2], [100, 0]],
    strokeWidth: 2,
    renderLabels: (d: Object) => d.y,
    renderTickX: (t: any) => t,
    renderTickY: (t: any) => t,
    ...DEFAULT_PROPS,
  }

  render() {
    const {
      color,
      data,
      height,
      id,
      linearGradient,
      padding,
      renderLabels,
      renderTickX,
      renderTickY,
      strokeWidth,
      tickCountX,
      tickCountY,
    } = this.props

    const tickLabelsStyle = {
      fill: colors.grey,
      fontSize: fontSizes[4],
      fontFamily: 'inherit',
      fontWeight: 'inherit',
    }

    return (
      <WrapperChart
        height={height}
        render={({ width }) => (
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
              domainPadding={{
                y: [0, space[1]],
              }}
              containerComponent={AreaChartContainer}
            >
              <VictoryAxis
                animate={false}
                tickCount={tickCountX}
                tickFormat={renderTickX}
                style={{
                  axis: {
                    stroke: colors.fog,
                  },
                  tickLabels: {
                    ...tickLabelsStyle,
                    padding: space[2],
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickCount={tickCountY}
                tickFormat={renderTickY}
                style={{
                  grid: {
                    stroke: colors.fog,
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
                data={data}
                x="name"
                y="value"
                labelComponent={areaChartTooltip}
                labels={renderLabels}
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
}
