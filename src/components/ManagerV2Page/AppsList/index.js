// @flow
import React, { useCallback, useState } from 'react'
import Box, { Card } from 'components/base/Box'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import Button from 'components/base/Button'
import Text from 'components/base/Text'
import IconSearch from 'icons/Search'
import IconLoader from 'icons/Loader'
import Input from 'components/base/Input'
import {
  getCryptoCurrencyById,
  isCurrencySupported,
} from '@ledgerhq/live-common/lib/data/cryptocurrencies'
import { getActionPlan, useAppsRunner } from '@ledgerhq/live-common/lib/apps'
import Item from './Item'
import DeviceStorage from '../DeviceStorage'
import Filter from './Filter'
import Sort from './Sort'
import Placeholder from './Placeholder'

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
`

const Tab = styled(Button)`
  padding: 0px;
  margin-right: 30px;
  text-transform: uppercase;
  border-radius: 0;
  border-bottom: ${p => (p.active ? `3px solid ${p.theme.colors.palette.primary.main}` : 'none')};
  padding-bottom: 4px;
  color: ${p =>
    p.active ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade30};
  &:hover {
    background: none;
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`

const FilterHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
  & > * {
    &:first-of-type {
      flex: 1;
    }
    border: none;
  }
`

const UpdatableHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
`

const Badge = styled(Text)`
  border-radius: 29px;
  background-color: ${p => p.theme.colors.palette.primary.main};
  color: ${p => p.theme.colors.palette.background.paper};
  height: 18px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
  margin-left: 10px;
`

const AppsList = ({ deviceInfo, listAppsRes, exec }: *) => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('name')
  const [state, dispatch] = useAppsRunner(listAppsRes, exec)
  const [activeTab, setActiveTab] = useState(0)
  const onDeviceTab = activeTab === 1
  const { currentProgress, currentError } = state
  const plan = getActionPlan(state)
  const onUpdateAll = useCallback(() => dispatch({ type: 'updateAll' }), [dispatch])

  const searchFilter = ({ name, currencyId }) => {
    if (!search) return true
    const currency = currencyId ? getCryptoCurrencyById(currencyId) : null
    const terms = `${name} ${currency ? `${currency.name} ${currency.ticker}` : ''}`
    return terms.toLowerCase().includes(search.toLowerCase().trim())
  }

  const typeFilter = app => {
    switch (filter) {
      case 'installed':
        return state.installed.find(a => a.name === app.name)
      case 'notInstalled':
        return !state.installed.find(a => a.name === app.name)
      case 'supported':
        return app.currencyId && isCurrencySupported(getCryptoCurrencyById(app.currencyId))
      default:
        return true
    }
  }

  const installedApps = state.installed
    .map(i => state.apps.find(a => a.name === i.name))
    .filter(Boolean)
    .filter(searchFilter)

  const updatableApps = state.installed
    .map(i => state.apps.find(a => a.name === i.name && !i.updated))
    .filter(Boolean)

  const appsList = (onDeviceTab ? installedApps : state.apps)
    .filter(searchFilter)
    .filter(typeFilter)

  const mapApp = (app, appStoreView, onlyUpdate) => (
    <Item
      state={state}
      key={app.name}
      scheduled={plan.find(a => a.name === app.name)}
      app={app}
      progress={currentProgress && currentProgress.appOp.name === app.name ? currentProgress : null}
      error={currentError && currentError.appOp.name === app.name ? currentError.error : null}
      installed={state.installed.find(ins => ins.name === app.name)}
      dispatch={dispatch}
      installedAvailable={state.installedAvailable}
      appStoreView={appStoreView}
      onlyUpdate={onlyUpdate}
      deviceModel={state.deviceModel}
    />
  )

  return (
    <Box>
      <Box mb={50}>
        <DeviceStorage
          state={state}
          deviceInfo={deviceInfo}
          installedApps={installedApps}
          plan={plan}
          dispatch={dispatch}
        />
      </Box>
      <Tabs>
        <Tab active={!onDeviceTab} onClick={() => setActiveTab(0)}>
          <Text ff="Inter|Bold" fontSize={6}>
            <Trans i18nKey="managerv2.tabs.appCatalog" />
          </Text>
        </Tab>
        <Tab active={onDeviceTab} onClick={() => setActiveTab(1)}>
          <Text ff="Inter|Bold" fontSize={6}>
            <Trans i18nKey="managerv2.tabs.appsOnDevice" />
          </Text>
        </Tab>
      </Tabs>

      {onDeviceTab && updatableApps.length ? (
        <Card mb={20}>
          <UpdatableHeader>
            <Text ff="Inter|SemiBold" fontSize={4} color="palette.primary.main">
              <Trans i18nKey="managerv2.applist.updatable.title" />
            </Text>
            <Badge ff="Inter|Bold" fontSize={3} color="palette.text.shade100">
              {updatableApps.length}
            </Badge>
            <Box flex={1} />
            <Button style={{ display: 'flex' }} primary onClick={onUpdateAll} fontSize={3}>
              <IconLoader size={14} />
              <Text style={{ marginLeft: 8 }}>
                <Trans i18nKey="managerv2.applist.item.updateAll" />
              </Text>
            </Button>
          </UpdatableHeader>
          <Box>{updatableApps.map(app => mapApp(app, false, true))}</Box>
        </Card>
      ) : null}

      <Card>
        <FilterHeader>
          <Input
            containerProps={{ noBoxShadow: true }}
            renderLeft={<IconSearch size={16} />}
            onChange={setSearch}
            placeholder="Search app or version number"
          />
          <Box mr={3}>
            <Sort onSortChange={setSort} sort={sort} />
          </Box>
          {!onDeviceTab ? <Filter onFilterChange={setFilter} filter={filter} /> : null}
        </FilterHeader>
        {appsList.length ? (
          appsList.map(app => mapApp(app, !onDeviceTab))
        ) : (
          <Placeholder installed={onDeviceTab} search={search} />
        )}
      </Card>
    </Box>
  )
}

export default AppsList
