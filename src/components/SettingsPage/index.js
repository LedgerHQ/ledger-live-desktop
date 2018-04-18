// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Switch, Route } from 'react-router'

import type { RouterHistory, Match, Location } from 'react-router'
import type { Settings, T } from 'types/common'
import type { SaveSettings } from 'actions/settings'
import type { FetchCounterValues } from 'actions/counterValues'

import { saveSettings } from 'actions/settings'
import { fetchCounterValues } from 'actions/counterValues'

import Pills from 'components/base/Pills'
import Box from 'components/base/Box'

import SectionDisplay from './sections/Display'
import SectionCurrencies from './sections/Currencies'
import SectionProfile from './sections/Profile'
import SectionAbout from './sections/About'

const mapStateToProps = state => ({
  settings: state.settings,
})

const mapDispatchToProps = {
  fetchCounterValues,
  saveSettings,
}

type Props = {
  fetchCounterValues: FetchCounterValues,
  history: RouterHistory,
  i18n: Object,
  location: Location,
  match: Match,
  saveSettings: SaveSettings,
  settings: Settings,
  t: T,
}

type State = {
  tab: Object,
}

class SettingsPage extends PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this._items = [
      {
        key: 'display',
        label: props.t('settings:tabs.display'),
        value: p => () => <SectionDisplay {...p} />,
      },
      {
        key: 'currencies',
        label: props.t('settings:tabs.currencies'),
        value: p => () => <SectionCurrencies {...p} />,
      },
      {
        key: 'profile',
        label: props.t('settings:tabs.profile'),
        value: p => () => <SectionProfile {...p} />,
      },
      {
        key: 'about',
        label: props.t('settings:tabs.about'),
        value: p => () => <SectionAbout {...p} />,
      },
    ]

    this.state = {
      tab: this.getCurrentTab({ url: props.match.url, pathname: props.location.pathname }),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({
        tab: this.getCurrentTab({
          url: nextProps.match.url,
          pathname: nextProps.location.pathname,
        }),
      })
    }
  }

  getCurrentTab = ({ url, pathname }) =>
    this._items.find(i => `${url}/${i.key}` === pathname) || this._items[0]

  _items = []

  handleChangeTab = (item: any) => {
    const { match, history, location } = this.props
    const url = `${match.url}/${item.key}`
    if (location.pathname !== url) {
      history.push(`${match.url}/${item.key}`)
    }
  }

  handleSaveSettings = newSettings => {
    const { fetchCounterValues, saveSettings, settings } = this.props

    saveSettings(newSettings)

    if (newSettings.counterValue !== settings.counterValue) {
      fetchCounterValues()
    }
  }

  render() {
    const { match, settings, t, i18n, saveSettings } = this.props
    const { tab } = this.state
    const props = {
      t,
      settings,
      saveSettings,
      i18n,
    }

    const defaultItem = this._items[0]

    return (
      <Box>
        <Box ff="Museo Sans|Regular" color="dark" fontSize={7} mb={5}>
          {t('settings:title')}
        </Box>
        <Pills mb={4} items={this._items} activeKey={tab.key} onChange={this.handleChangeTab} />
        <Switch>
          {this._items.map(i => (
            <Route key={i.key} path={`${match.url}/${i.key}`} render={i.value && i.value(props)} />
          ))}
          <Route render={defaultItem.value && defaultItem.value(props)} />
        </Switch>
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(SettingsPage)
