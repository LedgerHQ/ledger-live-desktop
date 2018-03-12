// @flow

/* eslint-disable react/no-multi-comp */

import React, { Fragment, Component, PureComponent } from 'react'

import VictoryChart from 'victory-chart/lib/components/victory-chart/victory-chart'
import VictoryArea from 'victory-chart/lib/components/victory-area/victory-area'
import VictoryAxis from 'victory-chart/lib/components/victory-axis/victory-axis'
import VictoryTooltip from 'victory-core/lib/victory-tooltip/victory-tooltip'
import VictoryVoronoiContainer from 'victory-chart/lib/components/containers/victory-voronoi-container'

import { space, colors, fontSizes } from 'styles/theme'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
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

class CustomTooltip extends Component<any, any> {
  static defaultEvents = VictoryTooltip.defaultEvents

  state = this.props

  componentWillMount() {
    this._mounted = true
  }

  componentWillReceiveProps(nextProps) {
    this._shouldRender = false
    this.updateState(nextProps)
  }

  shouldComponentUpdate(nextProps) {
    const isActive = nextProps.active === true
    const wasActive = this.props.active === true && !nextProps.active

    return (isActive && this._shouldRender) || wasActive
  }

  componentWillUnmount() {
    this._mounted = false
  }

  updateState = props =>
    window.requestAnimationFrame(() => {
      this._shouldRender = true
      if (this._mounted) {
        this.setState(props)
      }
    })

  _shouldRender = false
  _mounted = false

  render() {
    const { strokeWidth, dotColor, x, y, active, text, datum, renderer } = this.props

    if (!active) {
      return null
    }

    return (
      <g>
        <circle
          cx={x}
          cy={y + space[2]}
          r={strokeWidth}
          stroke={dotColor}
          strokeWidth={strokeWidth}
          fill={colors.white}
        />
        <foreignObject>
          <TooltipContainer
            style={{
              position: 'absolute',
              top: y - space[4],
              left: x,
              transform: `translate3d(-50%, 0, 0)`,
            }}
          >
            <Text style={{ lineHeight: 1 }}>{renderer(text(datum))}</Text>
          </TooltipContainer>
        </foreignObject>
      </g>
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

type Chart = GenericChart & {
  renderLabels: Function,
  renderTickX: Function,
  renderTickY: Function,
  renderTooltip: Function,
  tickCountX: number,
  tickCountY: number,
}

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

  _tooltip = (
    <CustomTooltip
      strokeWidth={this.props.strokeWidth}
      dotColor={this.props.color}
      renderer={this.props.renderTooltip}
    />
  )

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
                labelComponent={this._tooltip}
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
