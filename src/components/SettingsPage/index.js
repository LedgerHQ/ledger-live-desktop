// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import type { T } from 'types/common'
import { Switch, Route } from 'react-router'
import type { RouterHistory, Match, Location } from 'react-router'
import { accountsSelector } from 'reducers/accounts'
import Pills from 'components/base/Pills'
import Box from 'components/base/Box'
import SectionDisplay from './sections/Display'
import SectionCurrencies from './sections/Currencies'
import SectionHelp from './sections/Help'
import SectionAbout from './sections/About'
import SectionExperimental from './sections/Experimental'
import SectionExport from './sections/Export'

const mapStateToProps = state => ({
  accountsCount: accountsSelector(state).length,
})

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
  accountsCount: number,
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
        label: <Trans i18nKey="settings.tabs.display" />,
        value: SectionDisplay,
      },
      {
        key: 'currencies',
        label: <Trans i18nKey="settings.tabs.currencies" />,
        value: SectionCurrencies,
      },
      {
        key: 'export',
        label: <Trans i18nKey="settings.tabs.export" />,
        value: SectionExport,
      },
      {
        key: 'about',
        label: <Trans i18nKey="settings.tabs.about" />,
        value: SectionAbout,
      },
      {
        key: 'help',
        label: <Trans i18nKey="settings.tabs.help" />,
        value: SectionHelp,
      },
      {
        key: 'experimental',
        label: <Trans i18nKey="settings.tabs.experimental" />,
        value: SectionExperimental,
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

  render() {
    const { match, t, accountsCount } = this.props
    const { tab } = this.state

    const defaultItem = this._items[0]
    const items = this._items.filter(item => item.key !== 'currencies' || accountsCount > 0)

    return (
      <Box pb={4} selectable>
        <Box ff="Museo Sans|Regular" color="dark" fontSize={7} mb={5} data-e2e="settings_title">
          {t('settings.title')}
        </Box>
        <Pills mb={4} items={items} activeKey={tab.key} onChange={this.handleChangeTab} />
        <Switch>
          {items.map(i => <Route key={i.key} path={`${match.url}/${i.key}`} component={i.value} />)}
          <Route component={defaultItem.value} />
        </Switch>
      </Box>
    )
  }
}

export default compose(
  connect(mapStateToProps),
  translate(),
)(SettingsPage)
