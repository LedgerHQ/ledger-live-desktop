// @flow

import React, { useEffect, PureComponent } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { concat, from } from "rxjs";
import { ignoreElements, filter, map } from "rxjs/operators";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { isAccountEmpty, groupAddAccounts } from "@ledgerhq/live-common/lib/account";
import { openModal } from "~/renderer/actions/modals";
import { DeviceShouldStayInApp } from "@ledgerhq/errors";
import { getCurrencyBridge } from "@ledgerhq/live-common/lib/bridge";
import uniq from "lodash/uniq";
import { urls } from "~/config/urls";
import logger from "~/logger";
import { prepareCurrency } from "~/renderer/bridge/cache";
import TrackPage from "~/renderer/analytics/TrackPage";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import RetryButton from "~/renderer/components/RetryButton";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyBadge from "~/renderer/components/CurrencyBadge";
import AccountsList from "~/renderer/components/AccountsList";
import Spinner from "~/renderer/components/Spinner";
import Text from "~/renderer/components/Text";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";

import type { StepProps } from "..";

// $FlowFixMe
const remapTransportError = (err: mixed, appName: string): Error => {
  if (!err || typeof err !== "object") return err;

  const { name, statusCode } = err;

  const errorToThrow =
    name === "BtcUnmatchedApp" || statusCode === 0x6982 || statusCode === 0x6700
      ? new DeviceShouldStayInApp(null, { appName })
      : err;

  return errorToThrow;
};

const LoadingRow = styled(Box).attrs(() => ({
  horizontal: true,
  borderRadius: 1,
  px: 3,
  alignItems: "center",
  justifyContent: "center",
  mt: 1,
}))`
  height: 48px;
  border: 1px dashed ${p => p.theme.colors.palette.text.shade60};
`;

const SectionAccounts = ({ defaultSelected, ...rest }: *) => {
  // componentDidMount-like effect
  useEffect(() => {
    if (defaultSelected && rest.onSelectAll) {
      rest.onSelectAll(rest.accounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <AccountsList {...rest} />;
};

class StepImport extends PureComponent<StepProps> {
  componentDidMount() {
    this.props.setScanStatus("scanning");
  }

  componentDidUpdate(prevProps: StepProps) {
    const didStartScan =
      prevProps.scanStatus !== "scanning" && this.props.scanStatus === "scanning";
    const didFinishScan =
      prevProps.scanStatus !== "finished" && this.props.scanStatus === "finished";

    // handle case when we click on retry sync
    if (didStartScan) {
      this.startScanAccountsDevice();
    }

    // handle case when we click on stop sync
    if (didFinishScan) {
      this.unsub();
    }
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
    const { currency, device, setScanStatus, setScannedAccounts, blacklistedTokenIds } = this.props;
    if (!currency || !device) return;
    const mainCurrency = currency.type === "TokenCurrency" ? currency.parentCurrency : currency;
    try {
      const bridge = getCurrencyBridge(mainCurrency);

      // will be set to false if an existing account is found
      let onlyNewAccounts = true;

      const syncConfig = {
        paginationConfig: {
          operations: 20,
        },
        blacklistedTokenIds,
      };

      this.scanSubscription = concat(
        from(prepareCurrency(mainCurrency)).pipe(ignoreElements()),
        bridge.scanAccounts({ currency: mainCurrency, deviceId: device.deviceId, syncConfig }),
      )
        .pipe(
          filter(e => e.type === "discovered"),
          map(e => e.account),
        )
        .subscribe({
          next: account => {
            const { scannedAccounts, checkedAccountsIds, existingAccounts } = this.props;
            const hasAlreadyBeenScanned = !!scannedAccounts.find(a => account.id === a.id);
            const hasAlreadyBeenImported = !!existingAccounts.find(a => account.id === a.id);
            const isNewAccount = isAccountEmpty(account);
            if (!isNewAccount && !hasAlreadyBeenImported) {
              onlyNewAccounts = false;
            }
            if (!hasAlreadyBeenScanned) {
              setScannedAccounts({
                scannedAccounts: [...scannedAccounts, account],
                checkedAccountsIds: onlyNewAccounts
                  ? hasAlreadyBeenImported || checkedAccountsIds.length > 0
                    ? checkedAccountsIds
                    : [account.id]
                  : !hasAlreadyBeenImported && !isNewAccount
                  ? uniq([...checkedAccountsIds, account.id])
                  : checkedAccountsIds,
              });
            }
          },
          complete: () => {
            setScanStatus("finished");
          },
          error: err => {
            logger.critical(err);
            const error = remapTransportError(err, currency.name);
            setScanStatus("error", error);
          },
        });
    } catch (err) {
      setScanStatus("error", err);
    }
  }

  handleRetry = () => {
    this.unsub();
    this.props.resetScanState();
    this.startScanAccountsDevice();
  };

  handleToggleAccount = (account: Account) => {
    const { checkedAccountsIds, setScannedAccounts } = this.props;
    const isChecked = checkedAccountsIds.find(id => id === account.id) !== undefined;
    if (isChecked) {
      setScannedAccounts({
        checkedAccountsIds: checkedAccountsIds.filter(id => id !== account.id),
      });
    } else {
      setScannedAccounts({ checkedAccountsIds: [...checkedAccountsIds, account.id] });
    }
  };

  handleSelectAll = (accountsToSelect: Account[]) => {
    const { setScannedAccounts, checkedAccountsIds } = this.props;
    setScannedAccounts({
      checkedAccountsIds: uniq(checkedAccountsIds.concat(accountsToSelect.map(a => a.id))),
    });
  };

  handleUnselectAll = (accountsToRemove: Account[]) => {
    const { setScannedAccounts, checkedAccountsIds } = this.props;
    setScannedAccounts({
      checkedAccountsIds: checkedAccountsIds.filter(id => !accountsToRemove.some(a => id === a.id)),
    });
  };

  render() {
    const {
      scanStatus,
      currency,
      err,
      scannedAccounts,
      checkedAccountsIds,
      existingAccounts,
      setAccountName,
      editedNames,
      t,
    } = this.props;
    if (!currency) return null;
    const mainCurrency = currency.type === "TokenCurrency" ? currency.parentCurrency : currency;

    if (err) {
      return (
        <ErrorDisplay error={err} withExportLogs={err.name !== "SatStackDescriptorNotImported"} />
      );
    }

    const currencyName = mainCurrency ? mainCurrency.name : "";

    const { sections, alreadyEmptyAccount } = groupAddAccounts(existingAccounts, scannedAccounts, {
      scanning: scanStatus === "scanning",
    });

    const emptyTexts = {
      importable: t("addAccounts.noAccountToImport", { currencyName }),

      creatable: alreadyEmptyAccount ? (
        <Trans i18nKey="addAccounts.createNewAccount.noOperationOnLastAccount" parent="div">
          {" "}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {alreadyEmptyAccount.name}
          </Text>{" "}
        </Trans>
      ) : (
        <Trans i18nKey="addAccounts.createNewAccount.noAccountToCreate" parent="div">
          {" "}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {currencyName}
          </Text>{" "}
        </Trans>
      ),
    };

    return (
      <>
        <TrackPage category="AddAccounts" name="Step3" currencyName={currencyName} />
        <Box mt={-4}>
          {sections.map(({ id, selectable, defaultSelected, data, supportLink }, i) => (
            <SectionAccounts
              currency={currency}
              defaultSelected={defaultSelected}
              key={id}
              title={t(`addAccounts.sections.${id}.title`, { count: data.length })}
              emptyText={emptyTexts[id]}
              accounts={data}
              autoFocusFirstInput={selectable && i === 0}
              hideAmount={id === "creatable"}
              supportLink={supportLink}
              checkedIds={!selectable ? undefined : checkedAccountsIds}
              onToggleAccount={!selectable ? undefined : this.handleToggleAccount}
              setAccountName={!selectable ? undefined : setAccountName}
              editedNames={!selectable ? undefined : editedNames}
              onSelectAll={!selectable ? undefined : this.handleSelectAll}
              onUnselectAll={!selectable ? undefined : this.handleUnselectAll}
            />
          ))}

          {scanStatus === "scanning" ? (
            <LoadingRow>
              <Spinner color="palette.text.shade60" size={16} />
              <Box ml={2} ff="Inter|Regular" color="palette.text.shade60" fontSize={4}>
                {t("common.sync.syncing")}
              </Box>
            </LoadingRow>
          ) : null}
        </Box>

        {err && <Box shrink>{err.message}</Box>}
      </>
    );
  }
}

export default StepImport;

export const StepImportFooter = ({
  transitionTo,
  setScanStatus,
  scanStatus,
  onClickAdd,
  onCloseModal,
  checkedAccountsIds,
  scannedAccounts,
  currency,
  err,
  t,
}: StepProps) => {
  const dispatch = useDispatch();
  const willCreateAccount = checkedAccountsIds.some(id => {
    const account = scannedAccounts.find(a => a.id === id);
    return account && isAccountEmpty(account);
  });

  const willAddAccounts = checkedAccountsIds.some(id => {
    const account = scannedAccounts.find(a => a.id === id);
    return account && !isAccountEmpty(account);
  });

  const count = checkedAccountsIds.length;
  const willClose = !willCreateAccount && !willAddAccounts;
  const isHandledError = err && err.name === "SatStackDescriptorNotImported";

  const ctaWording =
    scanStatus === "scanning"
      ? t("common.sync.syncing")
      : willClose
      ? t("common.close")
      : t("addAccounts.cta.add", { count });

  const onClick = willClose
    ? onCloseModal
    : async () => {
        await onClickAdd();
        transitionTo("finish");
      };

  const goFullNode = () => {
    onCloseModal();
    dispatch(openModal("MODAL_FULL_NODE", { skipNodeSetup: true }));
  };

  return (
    <>
      <Box grow>{currency && <CurrencyBadge currency={currency} />}</Box>
      {scanStatus === "error" &&
        (isHandledError ? (
          <Button id={"add-accounts-full-node-reconfigure"} primary onClick={goFullNode}>
            {t("addAccounts.fullNodeConfigure")}
          </Button>
        ) : (
          <>
            <ExternalLinkButton label={t("common.getSupport")} url={urls.syncErrors} />

            <RetryButton
              id={"add-accounts-import-retry-button"}
              primary
              onClick={() => setScanStatus("scanning")}
            />
          </>
        ))}
      {scanStatus === "scanning" && (
        <Button id={"add-accounts-import-stop-button"} onClick={() => setScanStatus("finished")}>
          {t("common.stop")}
        </Button>
      )}

      {isHandledError ? null : (
        <Button
          id={"add-accounts-import-add-button"}
          primary
          disabled={scanStatus !== "finished"}
          onClick={onClick}
        >
          {ctaWording}
        </Button>
      )}
    </>
  );
};
