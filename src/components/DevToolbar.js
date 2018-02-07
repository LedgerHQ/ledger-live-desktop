// @flow

import React, { PureComponent } from 'react'
import { ipcRenderer } from 'electron'
import { AreaChart, Area } from 'recharts'
import takeRight from 'lodash/takeRight'
import last from 'lodash/last'
import reduce from 'lodash/fp/reduce'
import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import sortBy from 'lodash/fp/sortBy'
import styled from 'styled-components'
import color from 'color'

import Box from 'components/base/Box'
import CopyToClipboard from 'components/base/CopyToClipboard'

import theme from 'styles/theme'

type HslColor = {
  color: Array<number>,
}

type ColorType = {
  name: string,
  val: string,
  color: {
    isDark: () => boolean,
    hsl: () => HslColor,
  },
}

const transform = flow(
  reduce.convert({ cap: false })((acc, cur, key) => {
    const c = color(cur)
    return [
      ...acc,
      {
        name: key,
        val: cur,
        color: c,
        isDark: c.isDark(),
      },
    ]
  }, []),
  filter(el => el.name !== 'transparent'),
  sortBy(el => el.color.hsl().color[2]),
)

const colors: Array<ColorType> = transform(theme.colors)

const Container = styled(Box).attrs({
  bg: 'night',
  p: 1,
  color: 'white',
  fontSize: 0,
})`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1;
  border-top-left-radius: 3px;
  transition: ease-in-out transform 300ms;
  transform: translate3d(0, ${p => (p.isOpened ? '0' : '100%')}, 0);
`

const Handle = styled(Box).attrs({
  bg: 'night',
  justify: 'center',
  px: 1,
})`
  cursor: pointer;
  position: absolute;
  bottom: 100%;
  right: 5px;
  font-size: 9px;
  height: 20px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`

const Colors = styled(Box).attrs({
  horizontal: true,
  align: 'flex-start',
})`
  flex-wrap: wrap;
  width: ${(80 + 4) * 4}px;
`

const Cl = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  p: 2,
})`
  border: 2px solid white;
  cursor: pointer;
  margin: 2px;
  width: 80px;
`

const Color = ({ onClick, color }: { onClick: Function, color: ColorType }) => (
  <Cl bg={color.val} color={color.isDark ? 'white' : 'night'} onClick={onClick}>
    {color.name}
  </Cl>
)

type State = {
  isOpened: boolean,
  cpuUsage: Object,
}

class DevToolbar extends PureComponent<any, State> {
  state = {
    isOpened: false,
    cpuUsage: {},
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleMessage)
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleMessage)
  }

  handleMessage = (e: any, { type, data }: Object) => {
    if (type === 'usage.cpu') {
      this.setState(prev => ({
        cpuUsage: {
          ...prev.cpuUsage,
          [data.name]: takeRight(
            [
              ...(prev.cpuUsage[data.name] || []),
              {
                value: parseFloat(data.value),
              },
            ],
            10,
          ),
        },
      }))
    }
  }

  handleToggle = () => this.setState({ isOpened: !this.state.isOpened })

  render() {
    const { isOpened, cpuUsage } = this.state

    return (
      <Container isOpened={isOpened}>
        <Handle onClick={this.handleToggle}>{'DEV'}</Handle>
        <Box horizontal>
          <Colors>
            {colors.map(color => (
              <CopyToClipboard
                key={color.name}
                data={color.name}
                render={copy => <Color color={color} onClick={copy} />}
              />
            ))}
          </Colors>
          <Box ml={1}>
            {Object.keys(cpuUsage).map(k => (
              <Box key={k}>
                <Box horizontal align="center">
                  <Box grow>{k}</Box>
                  <Box fontSize="8px">{last(cpuUsage[k]).value}%</Box>
                </Box>
                <Box>
                  <AreaChart
                    width={100}
                    height={40}
                    data={cpuUsage[k]}
                    margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
                  >
                    <Area
                      type="monotone"
                      stroke="#8884d8"
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    )
  }
}

export default DevToolbar
