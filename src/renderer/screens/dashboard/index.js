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
import OperationsList from "~/renderer/components/OperationsList";
import Carousel from "~/renderer/components/Carousel";
import AssetDistribution from "~/renderer/components/AssetDistribution";
import MigrationBanner from "~/renderer/modals/MigrateAccounts/Banner";
import ClearCacheBanner from "~/renderer/components/ClearCacheBanner";
import UpdateBanner from "~/renderer/components/Updater/Banner";
import { saveSettings } from "~/renderer/actions/settings";
import { useDispatch, useSelector } from "react-redux";
import uniq from "lodash/uniq";
import { useHistory } from "react-router-dom";
import EmptyStateInstalledApps from "~/renderer/screens/dashboard/EmptyStateInstalledApps";
import EmptyStateAccounts from "~/renderer/screens/dashboard/EmptyStateAccounts";
import { useRefreshAccountsOrderingEffect } from "~/renderer/actions/general";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";

// This forces only one visible top banner at a time
export const TopBannerContainer: ThemedComponent<{}> = styled.div`
  z-index: 19;

  & > *:not(:first-child) {
    display: none;
  }
`;

export default function DashboardPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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

  const onAccountClick = useCallback(
    account =>
      history.push({ pathname: `/account/${account.id}`, state: { source: "dashboard page" } }),
    [history],
  );
  const handleChangeSelectedTime = useCallback(
    item => dispatch(saveSettings({ selectedTimeRange: item.key })),
    [dispatch],
  );
  const showCarousel = hasInstalledApps && totalAccounts > 0;

  useRefreshAccountsOrderingEffect({ onMount: true });

  return (
    <>
      <TopBannerContainer>
        <UpdateBanner />
        <MigrationBanner />
        <ClearCacheBanner />
        <CurrencyDownStatusAlert currencies={currencies} />
      </TopBannerContainer>
      {showCarousel ? <Carousel /> : null}
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
              counterValue={counterValue}
              chartId="dashboard-chart"
              chartColor={colors.wallet}
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
}
