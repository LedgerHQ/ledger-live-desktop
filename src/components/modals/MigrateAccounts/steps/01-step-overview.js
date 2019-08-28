// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import { Trans } from 'react-i18next'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconExternalLink from 'icons/ExternalLink'
import type { StepProps } from '../index'
import { i } from '../../../../helpers/staticPath'
import LedgerLiveLogo from '../../../base/LedgerLiveLogo'
import AccountRow from '../../../base/AccountsList/AccountRow'
import { openURL } from '../../../../helpers/linking'
import { urls } from '../../../../config/urls'
import { rgba } from '../../../../styles/helpers'

const Wrapper = styled.div`
  width: 100%;
  margin-top: 40px;
`
const AccountsWrapper = styled.div`
  margin-top: 15px;
  & > * {
    margin-bottom: 10px;
  }
`
const Currency = styled.div``
const Logo = styled.div`
  margin-bottom: 15px;
`
const Title = styled.div`
  margin-bottom: 10px;
`
const Footer = styled.div`
  display: flex;
  flex: 1;
  color: ${p => p.theme.colors.wallet};
  flex-direction: row;

  > :nth-child(2) {
    flex: 1;
    margin-left: 14px;
    margin-right: 14px;
  }
`
const HelpLink = styled.span.attrs({
  flow: 1,
  fontSize: 4,
})`
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  & > :nth-child(1) {
    text-decoration: underline;
    margin-right: 5px;
  }
  &:hover {
    cursor: pointer;
    color: ${p => rgba(p.theme.colors.wallet, 0.9)};
  }
`
const FooterContent = styled(Box).attrs({
  flow: 2,
  horizontal: true,
  align: 'center',
})`
  justify: flex-end;
`

const Exclamation = styled.div`
  align-self: center;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: ${p => p.theme.colors.pillActiveBackground};
  align-items: center;
  display: flex;
  justify-content: center;
`

const NextDeviceWarning = styled.div`
  display: inline-flex;
  background: ${p => p.theme.colors.pillActiveBackground};
  border-radius: 4px;
  padding: 14px 19px;
  margin-bottom: 11px;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  & > :first-child {
    margin-right: 17px;
  }
  & > :nth-child(2) {
    flex: 1;
  }
`

const TextWrap = styled(Box)`
  & > :first-child {
    margin-right: 10px;
  }
  display: inline;
`

const StepOverview = ({ migratableAccounts, currency, totalMigratableAccounts }: StepProps) => {
  const migratableCurrencyIds = Object.keys(migratableAccounts)

  return (
    <Box align="center">
      <TrackPage category="MigrateAccounts" name="Step1" />

      <Logo>
        <LedgerLiveLogo
          width="58px"
          height="58px"
          icon={<img src={i('ledgerlive-logo.svg')} alt="" width={35} height={35} />}
        />
      </Logo>
      <Title>
        <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
          <Trans
            i18nKey={
              !totalMigratableAccounts
                ? 'migrateAccounts.overview.done'
                : 'migrateAccounts.overview.title'
            }
          />
        </Text>
      </Title>
      {totalMigratableAccounts ? (
        <>
          <Text color="graphite" ff="Open Sans|Regular" fontSize={4}>
            <Trans i18nKey="migrateAccounts.overview.description" />
          </Text>

          {migratableAccounts && (
            <Wrapper>
              {!currency ? (
                <NextDeviceWarning>
                  <IconExclamationCircle size={16} />
                  <TextWrap ff="Open Sans|Bold" fontSize={4}>
                    <Text>
                      <Trans
                        i18nKey="migrateAccounts.overview.pendingDevices"
                        count={totalMigratableAccounts}
                        values={{ totalMigratableAccounts }}
                      />
                    </Text>
                    <HelpLink onClick={() => openURL(urls.migrateAccounts)}>
                      <Text>
                        <Trans i18nKey="common.needHelp" />
                      </Text>
                      <IconExternalLink size={14} />
                    </HelpLink>
                  </TextWrap>
                </NextDeviceWarning>
              ) : null}
              {migratableCurrencyIds.map(currencyId => {
                const accounts = migratableAccounts[currencyId]
                return (
                  <Currency key={currencyId}>
                    <Text color="dark" ff="Open Sans|SemiBold" fontSize={4}>
                      <Trans
                        i18nKey="migrateAccounts.overview.currency"
                        count={accounts.length}
                        values={{
                          currency: accounts[0].currency.name,
                          accounts: accounts.length,
                        }}
                      />
                    </Text>
                    <AccountsWrapper>
                      {accounts.map(account => (
                        <AccountRow
                          isReadonly
                          key={account.id}
                          account={account}
                          accountName={account.name}
                        />
                      ))}
                    </AccountsWrapper>
                  </Currency>
                )
              })}
            </Wrapper>
          )}
        </>
      ) : null}
    </Box>
  )
}

export default StepOverview

export const StepOverviewFooter = ({
  transitionTo,
  t,
  migratableAccounts,
  totalMigratableAccounts,
  currency,
  moveToNextCurrency,
  hideLoopNotice,
  onCloseModal,
}: StepProps) => (
  <Fragment>
    {!totalMigratableAccounts ? (
      <FooterContent>
        <Button primary onClick={onCloseModal}>
          {t('common.done')}
        </Button>
      </FooterContent>
    ) : !currency && !hideLoopNotice ? (
      <FooterContent>
        <Button onClick={onCloseModal}>{t('migrateAccounts.overview.doItLaterBtn')}</Button>
        <Button
          primary
          onClick={() => {
            moveToNextCurrency()
            transitionTo('device')
          }}
        >
          {t('common.continue')}
        </Button>
      </FooterContent>
    ) : (
      <Footer>
        <Exclamation>
          <IconExclamationCircle size={16} />
        </Exclamation>
        <Box>
          <Text color="wallet" ff="Open Sans|Bold" fontSize={12}>
            <Trans i18nKey="migrateAccounts.overview.footer" />
          </Text>
        </Box>
        <Box horizontal align="center" justify="flex-end" flow={2}>
          <Button
            disabled={!Object.keys(migratableAccounts).length}
            primary
            onClick={async () => {
              transitionTo('device')
            }}
          >
            {t('migrateAccounts.cta.startUpdate')}
          </Button>
        </Box>
      </Footer>
    )}
  </Fragment>
)
