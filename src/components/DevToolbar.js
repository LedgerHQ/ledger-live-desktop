// @flow

import React, { PureComponent } from 'react'
import { remote, ipcRenderer } from 'electron'
import { translate } from 'react-i18next'
import { AreaChart, Area } from 'recharts'
import takeRight from 'lodash/takeRight'
import last from 'lodash/last'
import reduce from 'lodash/fp/reduce'
import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import sortBy from 'lodash/fp/sortBy'
import chunk from 'lodash/chunk'
import styled from 'styled-components'
import color from 'color'

import Box from 'components/base/Box'
import Bar from 'components/base/Bar'
import CopyToClipboard from 'components/base/CopyToClipboard'

import theme from 'styles/theme'

const mainWindow = remote.BrowserWindow.getAllWindows().find(w => w.name === 'MainWindow')

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
  p: 5,
  grow: true,
  color: 'white',
  fontSize: 3,
})``

const Colors = styled(Box).attrs({
  horizontal: true,
  flow: 4,
})``

const Cl = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  p: 2,
})`
  border: 2px solid white;
  flex: 1;
  cursor: pointer;
`

const Color = ({ onClick, color }: { onClick: Function, color: ColorType }) => (
  <Cl bg={color.val} color={color.isDark ? 'white' : 'night'} onClick={onClick}>
    {color.name}
  </Cl>
)

const Lang = styled(Box).attrs({
  bg: 'night',
  color: 'white',
  borderColor: 'white',
  borderWidth: 2,
  borderRadius: 1,
  p: 2,
})`
  cursor: pointer;
`

type State = {
  cpuUsage: Object,
}

class DevToolbar extends PureComponent<any, State> {
  state = {
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

  handleChangeLanguage = lang => () => {
    mainWindow.webContents.send('msg', {
      type: 'application.changeLanguage',
      data: lang,
    })
  }

  render() {
    const { i18n } = this.props
    const { cpuUsage } = this.state

    return (
      <Container>
        <Box grow flow={4}>
          <Box flow={4} horizontal>
            {Object.keys(i18n.store.data).map(lang => (
              <Lang key={lang} onClick={this.handleChangeLanguage(lang)}>
                {lang}
              </Lang>
            ))}
          </Box>
          <Bar size={2} color="white" />
          <Box flow={4}>
            {chunk(colors, 8).map((c, i) => (
              <Colors
                key={i} // eslint-disable-line react/no-array-index-key
              >
                {c.map(color => (
                  <CopyToClipboard
                    key={color.name}
                    data={color.name}
                    render={copy => <Color color={color} onClick={copy} />}
                  />
                ))}
              </Colors>
            ))}
          </Box>
          <Bar size={2} color="white" />
          <Box flow={4} horizontal>
            {Object.keys(cpuUsage)
              .sort()
              .map(k => (
                <Box key={k}>
                  <Box horizontal align="center" flow={2}>
                    <Box fontSize={1}>{last(cpuUsage[k]).value}%</Box>
                    <Box>{k}</Box>
                  </Box>
                  <Box>
                    <AreaChart
                      width={100}
                      height={40}
                      data={cpuUsage[k]}
                      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
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

export default translate()(DevToolbar)
