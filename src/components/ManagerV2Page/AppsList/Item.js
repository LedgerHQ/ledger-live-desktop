// @flow
import React, { useCallback, useMemo } from 'react'
import {
  formatSize,
  isOutOfMemoryState,
  predictOptimisticState,
  reducer,
} from '@ledgerhq/live-common/lib/apps'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { isCurrencySupported } from '@ledgerhq/live-common/lib/data/cryptocurrencies'

import styled from 'styled-components'
import { Trans } from 'react-i18next'
import manager from '@ledgerhq/live-common/lib/manager'
import Button from 'components/base/Button'

import Tooltip from 'components/base/Tooltip'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import TrashIcon from 'icons/Trash'
import IconLoader from 'icons/Loader'
import IconArrowDown from 'icons/ArrowDown'

import IconCheck from 'icons/Check'
import IconError from 'icons/Error'
import { colors } from 'styles/theme'
import Progress from './Progress'

const AppRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
  }
  padding: 20px;
  font-size: 12px;

  & > * {
    &:first-of-type {
      width: 300px;
    }
  }
`

const AppName = styled.div`
  flex-direction: column;
  padding-left: 15px;
  & > * {
    display: block;
  }
`

const AppSize = styled.div`
  padding-left: 80px;
  flex: 1;
  color: ${p => p.theme.colors.palette.text.shade40};
`

const AppActions = styled.div`
  display: flex;
  min-width: 150px;
  justify-content: flex-end;
  flex-direction: row;
  > *:not(:last-child) {
    margin-right: 10px;
  }
`

const SuccessInstall = styled.div`
  color: ${p => p.theme.colors.positiveGreen};
  display: flex;
  flex-direction: row;
  > svg {
    padding-right: 5px;
  }
`

const LiveCompatible = styled.div`
  flex: 1;
  & > * > * {
    align-items: center;
    justify-content: center;
    padding: 3px;
    display: flex;
    color: ${p => p.theme.colors.palette.background.paper};
    background: ${p => p.theme.colors.palette.primary.main};
    border-radius: 50%;
  }
`

type Props = * // FIXME

const Item: React$ComponentType<Props> = React.memo(
  ({
    state,
    app,
    installed,
    installedAvailable,
    scheduled,
    dispatch,
    progress,
    error,
    appStoreView,
    onlyUpdate,
    deviceModel,
  }) => {
    const { name } = app
    const onInstall = useCallback(() => dispatch({ type: 'install', name }), [dispatch, name])
    const onUninstall = useCallback(() => dispatch({ type: 'uninstall', name }), [dispatch, name])

    const notEnoughMemoryToInstall = useMemo(
      () => isOutOfMemoryState(predictOptimisticState(reducer(state, { type: 'install', name }))),
      [name, state],
    )

    const isLiveSupported =
      app.currencyId && isCurrencySupported(getCryptoCurrencyById(app.currencyId))

    return (
      <AppRow>
        <Box flex horizontal>
          <img alt="" src={manager.getIconUrl(app.icon)} width={40} height={40} />
          <AppName>
            <Text ff="Inter|Bold" color="palette.text.shade100" fontSize={3}>{`${app.name}${
              app.currencyId ? ` (${getCryptoCurrencyById(app.currencyId).ticker})` : ''
            }`}</Text>
            <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={2}>{`Version ${
              app.version
            }${installed && !installed.updated ? ' (NEW)' : ''}`}</Text>
          </AppName>
        </Box>
        <AppSize>
          {formatSize(
            ((installed && installed.blocks) || 0) * deviceModel.deviceSize || app.bytes || 0,
          )}
        </AppSize>
        <LiveCompatible>
          {isLiveSupported ? (
            <Tooltip content={<Trans i18nKey="managerv2.applist.item.supported" />}>
              <IconLoader size={16} />
            </Tooltip>
          ) : null}
        </LiveCompatible>
        {error ? (
          <Button danger title={String(error)}>
            <IconError size={14} />
            <Trans i18nKey="managerv2.applist.item.error" />
          </Button>
        ) : progress || scheduled ? (
          <Progress
            onClick={
              (progress ? progress.appOp : scheduled).type === 'install' ? onUninstall : onInstall
            }
            progress={progress}
          />
        ) : (
          <AppActions>
            {(installed || !installedAvailable) && !appStoreView && !onlyUpdate ? (
              <Button style={{ padding: 12 }} lighterDanger onClick={onUninstall}>
                <TrashIcon color={colors.alertRed} size={14} />
              </Button>
            ) : null}
            {appStoreView && installed && installed.updated ? (
              <SuccessInstall>
                <IconCheck size={16} />
                <Text ff="Inter|SemiBold" fontSize={4}>
                  <Trans i18nKey="managerv2.applist.item.installed" />
                </Text>
              </SuccessInstall>
            ) : null}

            {installed && !installed.updated ? (
              <Button
                style={{ display: 'flex' }}
                disabled={notEnoughMemoryToInstall}
                {...{ [onlyUpdate ? 'lighterPrimary' : 'primary']: true }}
                onClick={notEnoughMemoryToInstall ? null : onInstall}
                fontSize={3}
              >
                <IconLoader size={14} />
                <Text style={{ marginLeft: 8 }}>
                  <Trans i18nKey="managerv2.applist.item.update" />
                </Text>
              </Button>
            ) : !installed ? (
              <Tooltip
                content={
                  notEnoughMemoryToInstall ? (
                    <Trans i18nKey="managerv2.applist.item.notEnoughSpace" />
                  ) : null
                }
              >
                <Button
                  style={{ display: 'flex' }}
                  lighterPrimary
                  disabled={notEnoughMemoryToInstall}
                  onClick={notEnoughMemoryToInstall ? null : onInstall}
                >
                  <IconArrowDown size={14} />
                  <Text style={{ marginLeft: 8 }}>
                    <Trans i18nKey="managerv2.applist.item.install" />
                  </Text>
                </Button>
              </Tooltip>
            ) : null}
          </AppActions>
        )}
      </AppRow>
    )
  },
)

export default Item
