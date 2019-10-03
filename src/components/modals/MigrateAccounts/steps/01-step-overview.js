// @flow

import React, { Fragment, useState } from 'react'
import styled from 'styled-components'

import { Trans } from 'react-i18next'
import reduce from 'lodash/reduce'
import TrackPage from 'analytics/TrackPage'
import SuccessAnimatedIcon from 'components/base/SuccessAnimatedIcon'
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
import ExportAccountsModal from '../../../SettingsPage/ExportAccountsModal'

const getAllImportedAccounts = accountsByAsset =>
  reduce(accountsByAsset, (acc, accounts) => [...acc, ...accounts], [])

const Wrapper = styled.div`
  width: 100%;
  margin-top: 40px;
`

const MobileCTA = styled(Button)`
  width: 100%;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  margin-top: 18px;
`

const MobileIllu = styled.img`
  margin-left: 16px;
`

const Desc = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 4,
  mt: 2,
  color: 'palette.text.shade80',
}))`
  text-align: center;
`

const AccountsWrapper = styled.div`
  margin-top: 15px;
  & > * {
    margin-bottom: 10px;
  }
`

const MobileTextWrapper = styled.div`
  margin-left: 16px;
  flex: 1;
`

const MobileWrapper = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 4,
  mt: 2,
  color: 'palette.text.shade80',
}))`
  border-radius: 4px;
  margin-top: 20px;
  margin-left: 16px;
  margin-right: 16px;
  border: solid 1px ${props => props.theme.colors.palette.divider};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
`

const MobileContent = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: row;
`
const Currency = styled.div``
const Logo = styled.div`
  margin-bottom: 15px;
`
const Title = styled.div`
  margin-bottom: 10px;
`

const MobileDesc = styled.div`
  margin-top: 6px;
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
const HelpLink = styled.span.attrs(() => ({
  flow: 1,
  fontSize: 4,
}))`
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
const FooterContent = styled(Box).attrs(() => ({
  flow: 2,
  horizontal: true,
  align: 'center',
}))`
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

const StepOverview = ({
  migratableAccounts,
  currency,
  currencyIds,
  migratedAccounts,
}: StepProps) => {
  const migratedAccountNames = Object.keys(migratedAccounts)
  const [isExporting, setExporting] = useState(false)

  return (
    <Box align="center">
      <ExportAccountsModal
        onClose={() => setExporting(false)}
        isOpen={isExporting}
        accounts={getAllImportedAccounts(migratedAccounts)}
      />

      <TrackPage category="MigrateAccounts" name="Step1" />

      <Logo>
        {migratableAccounts.length ? (
          <LedgerLiveLogo
            width="58px"
            height="58px"
            icon={<img src={i('ledgerlive-logo.svg')} alt="" width={35} height={35} />}
          />
        ) : (
          <SuccessAnimatedIcon width={70} height={70} />
        )}
      </Logo>
      <Title>
        <Text ff="Inter|Regular" fontSize={6} color="palette.text.shade100">
          <Trans
            i18nKey={
              !migratableAccounts.length
                ? 'migrateAccounts.overview.successTitle'
                : 'migrateAccounts.overview.title'
            }
          />
        </Text>
      </Title>
      {migratableAccounts.length ? (
        <>
          <Text color="palette.text.shade80" ff="Inter|Regular" fontSize={4}>
            <Trans i18nKey="migrateAccounts.overview.description" />
          </Text>

          {migratableAccounts && (
            <Wrapper>
              {!currency ? (
                <NextDeviceWarning>
                  <IconExclamationCircle size={16} />
                  <TextWrap ff="Inter|Bold" fontSize={4}>
                    <Text>
                      <Trans
                        i18nKey="migrateAccounts.overview.pendingDevices"
                        count={migratableAccounts.length}
                        values={{ totalMigratableAccounts: migratableAccounts.length }}
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
              {currencyIds.map(currencyId => {
                const accounts = migratableAccounts.filter(a => a.currency.id === currencyId)
                return (
                  <Currency key={currencyId}>
                    <Text color="palette.text.shade100" ff="Inter|SemiBold" fontSize={4}>
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
      ) : (
        <>
          <Desc>
            <Text color="palette.text.shade80" ff="Inter|Regular" fontSize={4}>
              <Trans
                i18nKey={`migrateAccounts.overview.${
                  migratedAccountNames.length > 1 ? 'successDescPlu' : 'successDesc'
                }`}
                values={{
                  assets: migratedAccountNames.join(' & '),
                }}
              />
            </Text>
          </Desc>
          <MobileWrapper>
            <MobileContent>
              <MobileIllu alt="" src={i('mobile-export.svg')} />
              <MobileTextWrapper>
                <Text ff="Inter|Regular" fontSize={5} color="palette.text.shade100">
                  <Trans i18nKey="migrateAccounts.overview.mobileTitle" />
                </Text>
                <MobileDesc>
                  <Text color="palette.text.shade80" ff="Inter|Regular" fontSize={4}>
                    <Trans i18nKey="migrateAccounts.overview.mobileDesc" />
                  </Text>
                </MobileDesc>
              </MobileTextWrapper>
            </MobileContent>
            <MobileCTA primary onClick={() => setExporting(true)}>
              <Trans i18nKey="migrateAccounts.overview.mobileCTA" />
            </MobileCTA>
          </MobileWrapper>
        </>
      )}
    </Box>
  )
}

export default StepOverview

export const StepOverviewFooter = ({
  transitionTo,
  t,
  currencyIds,
  migratableAccounts,
  currency,
  moveToNextCurrency,
  hideLoopNotice,
  onCloseModal,
}: StepProps) => (
  <Fragment>
    {!migratableAccounts.length ? (
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
          <Text color="wallet" ff="Inter|Bold" fontSize={12}>
            <Trans i18nKey="migrateAccounts.overview.footer" />
          </Text>
        </Box>
        <Box horizontal align="center" justify="flex-end" flow={2}>
          <Button
            disabled={!currencyIds.length}
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
