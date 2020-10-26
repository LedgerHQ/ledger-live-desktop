// @flow
import React, { useCallback, useMemo } from "react";
import Box from "~/renderer/components/Box";
import { accountsSelector, currenciesSelector } from "~/renderer/reducers/accounts";
import BalanceSummary from "./GlobalSummary";
import { colors } from "~/renderer/styles/theme";

import {
  counterValueCurrencySelector,
  hasInstalledAppsSelector,
  selectedTimeRangeSelector,
} from "~/renderer/reducers/settings";

import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TrackPage from "~/renderer/analytics/TrackPage";
import RefreshAccountsOrdering from "~/renderer/components/RefreshAccountsOrdering";
import OperationsList from "~/renderer/components/OperationsList";
import Carousel from "~/renderer/components/Carousel";
import AssetDistribution from "~/renderer/components/AssetDistribution";
import MigrationBanner from "~/renderer/modals/MigrateAccounts/Banner";
import ClearCacheBanner from "~/renderer/components/ClearCacheBanner";
import UpdateBanner from "~/renderer/components/Updater/Banner";
import { saveSettings } from "~/renderer/actions/settings";
import { connect, useSelector } from "react-redux";
import uniq from "lodash/uniq";
import type { Currency } from "@ledgerhq/live-common/lib/types/currencies";
import type { Account } from "@ledgerhq/live-common/lib/types/account";
import type { TimeRange } from "~/renderer/reducers/settings";
import { useHistory } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import EmptyStateInstalledApps from "~/renderer/screens/dashboard/EmptyStateInstalledApps";
import EmptyStateAccounts from "~/renderer/screens/dashboard/EmptyStateAccounts";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";

// This forces only one visible top banner at a time
export const TopBannerContainer: ThemedComponent<{}> = styled.div`
  z-index: 19;

  & > *:not(:first-child) {
    display: none;
  }
`;

type Props = {
  accounts: Account[],
  push: Function,
  counterValue: Currency,
  selectedTimeRange: TimeRange,
  saveSettings: ({ selectedTimeRange: TimeRange }) => *,
};

const DashboardPage = ({ saveSettings }: Props) => {
  const { t } = useTranslation();
  const accounts = useSelector(accountsSelector);
  const currencies = useSelector(currenciesSelector);
  const history = useHistory();
  const counterValue = useSelector(counterValueCurrencySelector);
  const selectedTimeRange = useSelector(selectedTimeRangeSelector);
  const hasInstalledApps = useSelector(hasInstalledAppsSelector);
  const totalAccounts = accounts.length;
  const totalCurrencies = useMemo(() => uniq(accounts.map(a => a.currency.id)).length, [accounts]);
  const totalOperations = useMemo(() => accounts.reduce((sum, a) => sum + a.operations.length, 0), [
    accounts,
  ]);

  const onAccountClick = useCallback(account => history.push(`/account/${account.id}`), [history]);
  const handleChangeSelectedTime = useCallback(
    item => saveSettings({ selectedTimeRange: item.key }),
    [saveSettings],
  );
  const showCarousel = hasInstalledApps && totalAccounts > 0;

  return (
    <>
      <TopBannerContainer>
        <UpdateBanner />
        <MigrationBanner />
        <ClearCacheBanner />
        <CurrencyDownStatusAlert currencies={currencies} />
      </TopBannerContainer>
      {showCarousel ? <Carousel /> : null}
      <RefreshAccountsOrdering onMount />
      <TrackPage
        category="Portfolio"
        totalAccounts={totalAccounts}
        totalOperations={totalOperations}
        totalCurrencies={totalCurrencies}
      />
      <Box flow={7} id="portfolio-container">
        {!hasInstalledApps ? (
          <EmptyStateInstalledApps />
        ) : totalAccounts > 0 ? (
          <>
            <BalanceSummary
              t={t}
              counterValue={counterValue}
              chartId="dashboard-chart"
              chartColor={colors.wallet}
              accounts={accounts}
              range={selectedTimeRange}
              handleChangeSelectedTime={handleChangeSelectedTime}
              selectedTimeRange={selectedTimeRange}
            />
            <AssetDistribution />
            {totalOperations > 0 && (
              <OperationsList
                onAccountClick={onAccountClick}
                accounts={accounts}
                title={t("dashboard.recentActivity")}
                withAccount
                withSubAccounts
              />
            )}
          </>
        ) : (
          <EmptyStateAccounts />
        )}
      </Box>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  counterValue: counterValueCurrencySelector,
  selectedTimeRange: selectedTimeRangeSelector,
});

const mapDispatchToProps = {
  saveSettings,
};

const ConnectedDashboardPage: React$ComponentType<{}> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardPage);

export default ConnectedDashboardPage;
