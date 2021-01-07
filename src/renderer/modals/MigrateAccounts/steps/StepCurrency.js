// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { filter, map, reduce } from "rxjs/operators";
import { findAccountMigration, migrateAccounts } from "@ledgerhq/live-common/lib/account";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import invariant from "invariant";
import last from "lodash/last";

import type { Account } from "@ledgerhq/live-common/lib/types";

import logger from "~/logger";
import Box from "~/renderer/components/Box";
import { getCurrencyBridge } from "~/renderer/bridge/proxy";
import { colors } from "~/renderer/styles/theme";
import TrackPage from "~/renderer/analytics/TrackPage";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";
import { CurrencyCircleIcon } from "~/renderer/components/CurrencyBadge";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import RetryButton from "~/renderer/components/RetryButton";
import Button from "~/renderer/components/Button";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import { urls } from "~/config/urls";
import type { StepProps } from "~/renderer/modals/MigrateAccounts";

const Exclamation = styled.div`
  align-self: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  margin-bottom: 20px;
  background-color: ${p => p.theme.colors.pillActiveBackground};
  align-items: center;
  display: flex;
  justify-content: center;
`;

class StepCurrency extends PureComponent<StepProps> {
  componentDidMount() {
    this.props.setScanStatus("scanning");
    this.startScanAccountsDevice();
  }

  componentWillUnmount() {
    this.unsub();
  }

  scanSubscription = null;

  unsub = () => {
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }
  };

  startScanAccountsDevice() {
    this.unsub();
    const {
      currency,
      device,
      setScanStatus,
      accounts,
      replaceAccounts,
      addMigratedAccount,
    } = this.props;

    if (!currency || !device) return;

    const syncConfig = {
      // TODO later we need to paginate only a few ops, not all (for add accounts)
      // paginationConfig will come from redux
      paginationConfig: {},
    };

    this.scanSubscription = getCurrencyBridge(currency)
      .scanAccounts({ currency, deviceId: device.deviceId, syncConfig })
      .pipe(
        filter(e => e.type === "discovered"),
        map(({ account }) => {
          if (getEnv("MOCK") && account.id.startsWith("mock:0")) {
            // If we have a mocked migratable account, change the version to one
            return { ...account, id: account.id.replace("mock:0", "mock:1") };
          }
          return account;
        }),
        reduce<Account>((all, acc) => all.concat(acc), []),
      )
      .subscribe({
        next: scannedAccounts => {
          let totalMigratedAccounts = 0;
          accounts.forEach(a => {
            const maybeMigration = findAccountMigration(a, scannedAccounts);
            if (maybeMigration) {
              totalMigratedAccounts++;
            }
          });

          const migratedAccounts = migrateAccounts({ scannedAccounts, existingAccounts: accounts });
          replaceAccounts(migratedAccounts);
          migratedAccounts.forEach((account: Account) => {
            addMigratedAccount(currency, account);
          });
          setScanStatus(totalMigratedAccounts ? "finished" : "finished-empty");
        },
        error: err => {
          logger.critical(err);
          setScanStatus("error", err);
        },
      });
  }

  render() {
    const { currency, scanStatus, err } = this.props;
    invariant(currency, "No crypto asset given");

    const currencyName = `${currency.name} (${currency.ticker})`;
    const pending = !["finished", "finished-empty"].includes(scanStatus);

    if (err) {
      return <ErrorDisplay error={err} withExportLogs />;
    }

    return (
      <>
        <TrackPage category="MigrateAccounts" name="Step3" />
        <Box alignItems="center" pt={pending ? 30 : 0} pb={pending ? 40 : 0}>
          {scanStatus === "finished-empty" ? (
            <Exclamation>
              <ExclamationCircle size={20} color={colors.wallet} />
            </Exclamation>
          ) : (
            <CurrencyCircleIcon
              showSpinner={pending}
              showCheckmark={!pending}
              borderRadius="10px"
              mb={15}
              size={40}
              currency={currency}
            />
          )}
          <Box
            ff="Inter|Regular"
            fontSize={6}
            color="palette.text.shade100"
            mb={10}
            textAlign="center"
            style={{ width: 370 }}
          >
            <Trans
              i18nKey={`migrateAccounts.progress.${scanStatus}.title`}
              parent="div"
              values={{ currencyName }}
            />
          </Box>
          <Text color="palette.text.shade80" ff="Inter|Regular" fontSize={4}>
            <Trans
              i18nKey={`migrateAccounts.progress.${scanStatus}.description`}
              values={{ currencyName }}
            />
          </Text>
        </Box>
      </>
    );
  }
}

export const StepCurrencyFooter = ({
  transitionTo,
  scanStatus,
  currencyIds,
  moveToNextCurrency,
  getNextCurrency,
  currency,
  migratableAccounts,
}: StepProps) => {
  if (scanStatus === "error") {
    return (
      <>
        <ExternalLinkButton
          mr={2}
          label={<Trans i18nKey="common.getSupport" />}
          url={urls.syncErrors}
        />
        <RetryButton primary onClick={() => transitionTo("device")} />
      </>
    );
  }
  if (!["finished", "finished-empty"].includes(scanStatus) || !currency) return null;
  const lastCurrency = last(currencyIds);
  const next = lastCurrency !== currency.id && currency.id < lastCurrency ? "device" : "overview";
  const nextCurrency = getNextCurrency();
  return (
    <Button
      primary
      id="migrate-currency-continue-button"
      onClick={() => {
        if (!migratableAccounts.length) {
          transitionTo("overview");
        } else {
          moveToNextCurrency(next === "overview");
          transitionTo(next);
        }
      }}
    >
      <Trans
        i18nKey={next === "device" ? "migrateAccounts.cta.nextCurrency" : "common.continue"}
        values={{ currency: nextCurrency ? nextCurrency.name : "" }}
      />
    </Button>
  );
};

export default StepCurrency;
