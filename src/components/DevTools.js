// @flow

/* eslint-disable import/no-named-as-default-member */

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
import fs from 'fs'
import path from 'path'

import Box from 'components/base/Box'
import Bar from 'components/base/Bar'
import CopyToClipboard from 'components/base/CopyToClipboard'
import { ChartWrapper } from 'components/base/Chart'

import staticPath from 'helpers/staticPath'

import theme from 'styles/theme'

const getLanguages = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())
const languages = getLanguages(path.join(staticPath, '/i18n'))

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

type SimpleType = {
  name: string,
  val: string,
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
const spaces: Array<SimpleType> = theme.space.map((s, i) => ({
  name: s.toString(),
  val: i.toString(),
}))
const fontSizes: Array<SimpleType> = theme.fontSizes.map((s, i) => ({
  name: s.toString(),
  val: i.toString(),
}))

const Container = styled(Box).attrs({
  bg: 'dark',
  p: 5,
  grow: true,
  color: 'white',
  fontSize: 3,
})``

const Title = styled(Box).attrs({
  color: 'white',
})`
  text-transform: uppercase;
`

const Items = styled(Box).attrs({
  horizontal: true,
  flow: 4,
})``

const Item = styled(Box).attrs({
  alignItems: 'center',
  bg: 'dark',
  borderRadius: 1,
  color: 'white',
  justifyContent: 'center',
  py: 2,
  px: 4,
})`
  border: 2px solid ${p => p.theme.colors.white};
  flex: 1;
  overflow: hidden;
  cursor: pointer;
`

type State = {
  cpuUsage: Object,
}

class DevTools extends PureComponent<any, State> {
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

  handleStartSync = () =>
    mainWindow.webContents.send('msg', {
      type: 'accounts.sync.start',
    })

  handleStopSync = () =>
    mainWindow.webContents.send('msg', {
      type: 'accounts.sync.stop',
    })

  render() {
    const { cpuUsage } = this.state

    return (
      <Container>
        <Box grow flow={4}>
          <Section title="Colors">
            {chunk(colors, 5).map((c, i) => (
              <Items
                key={i} // eslint-disable-line react/no-array-index-key
              >
                {c.map(color => (
                  <CopyToClipboard
                    key={color.name}
                    data={color.name}
                    render={copy => <Color color={color} onClick={copy} />}
                  />
                ))}
              </Items>
            ))}
          </Section>
          <Section title="Space">
            {chunk(spaces, 5).map((s, i) => (
              <Items
                key={i} // eslint-disable-line react/no-array-index-key
              >
                {s.map(space => (
                  <CopyToClipboard
                    key={space.val}
                    data={space.val}
                    render={copy => <Item onClick={copy}>{space.name}</Item>}
                  />
                ))}
              </Items>
            ))}
          </Section>
          <Section title="Font Sizes">
            {chunk(fontSizes, 5).map((f, i) => (
              <Items
                key={i} // eslint-disable-line react/no-array-index-key
              >
                {f.map(fontSize => (
                  <CopyToClipboard
                    key={fontSize.val}
                    data={fontSize.val}
                    render={copy => <Item onClick={copy}>{fontSize.name}</Item>}
                  />
                ))}
              </Items>
            ))}
          </Section>
          <Bar size={2} color="white" />
          <Section title="Languages" horizontal>
            {languages.map(lang => (
              <Item key={lang} onClick={this.handleChangeLanguage(lang)} style={{ flex: 0 }}>
                {lang}
              </Item>
            ))}
          </Section>
          <Bar size={2} color="white" />
          <Section title="Sync Accounts" horizontal>
            <Item onClick={this.handleStartSync} style={{ flex: 0 }}>
              Start
            </Item>
            <Item onClick={this.handleStopSync} style={{ flex: 0 }}>
              Stop
            </Item>
          </Section>
          <Bar size={2} color="white" />
          <Section title="CPU Usage">
            {chunk(Object.keys(cpuUsage).sort(), 2).map((l, i) => (
              <Items
                key={i} // eslint-disable-line react/no-array-index-key
              >
                {l.map(k => (
                  <Box key={k} style={{ flex: 1 }}>
                    <Box horizontal alignItems="center" flow={2}>
                      <Box fontSize={1}>{last(cpuUsage[k]).value}%</Box>
                      <Box>{k}</Box>
                    </Box>
                    <Box>
                      <ChartWrapper
                        render={({ width }) => (
                          <AreaChart
                            width={width}
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
                        )}
                      />
                    </Box>
                  </Box>
                ))}
              </Items>
            ))}
          </Section>
        </Box>
      </Container>
    )
  }
}

const Color = ({ onClick, color }: { onClick: Function, color: ColorType }) => (
  <Item bg={color.val} color={color.isDark ? 'white' : 'dark'} onClick={onClick}>
    {color.name}
  </Item>
)

const Section = ({
  title,
  children,
  horizontal,
}: {
  title: string,
  children: any,
  horizontal?: boolean,
}) => (
  <Box flow={2}>
    <Title>{title}</Title>
    <Box flow={4} horizontal={horizontal}>
      {children}
    </Box>
  </Box>
)

Section.defaultProps = {
  horizontal: false,
}

export default translate()(DevTools)
