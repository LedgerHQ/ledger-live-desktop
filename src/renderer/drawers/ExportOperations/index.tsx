import { remote, ipcRenderer } from "electron";
import React, { useState, useCallback, useContext, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import moment from "moment";
import { useCountervaluesState } from "@ledgerhq/live-common/lib/countervalues/react";
import { accountsOpToCSV } from "@ledgerhq/live-common/lib/csvExport";
import { Account } from "@ledgerhq/live-common/lib/types";
import { Alert, Icons, Flex, Text, Log } from "@ledgerhq/react-ui";
import logger from "~/logger";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import { context as DrawersContext } from "~/renderer/drawers/Provider";
import Button from "~/renderer/components/Button";
import AccountsList from "~/renderer/components/AccountsList";
import { Drawer } from "@ledgerhq/react-ui";

const exportOperations = async (
  path: { canceled: boolean; filePath: string },
  csv: string,
  callback?: () => void,
) => {
  try {
    const res = await ipcRenderer.invoke("export-operations", path, csv);
    if (res && callback) {
      callback();
    }
  } catch (error) {}
};

type ExportOperationsProps = {
  onClose: () => void;
  isOpen: boolean;
};

const ExportOperations = ({ isOpen, onClose }: ExportOperationsProps) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const counterValueState = useCountervaluesState();

  const accounts = useSelector(activeAccountsSelector);
  const counterValueCurrency = useSelector(counterValueCurrencySelector);

  // reset state when drawer is opened
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setCheckedIds([]);
    }
  }, [isOpen]);

  const { t } = useTranslation();

  const exportCsv = useCallback(async () => {
    const path = await remote.dialog.showSaveDialog({
      title: "Exported account transactions",
      defaultPath: `ledgerlive-operations-${moment().format("YYYY.MM.DD")}.csv`,
      filters: [
        {
          name: "All Files",
          extensions: ["csv"],
        },
      ],
    });

    if (path && path.filePath) {
      exportOperations(
        path as { canceled: boolean; filePath: string },
        accountsOpToCSV(
          accounts.filter(account => checkedIds.includes(account.id)),
          counterValueCurrency,
          counterValueState,
        ),
        () => {
          setSuccess(true);
        },
      );
    }
  }, [accounts, checkedIds, counterValueCurrency, counterValueState]);

  const handleContinueButtonClick = useCallback(() => {
    let exporting = false;
    if (exporting) return;
    exporting = true;
    exportCsv()
      .catch(e => {
        (logger as any).critical(e);
      })
      .then(() => {
        exporting = false;
      });
  }, [exportCsv, success]);

  const handleSelectAll = useCallback((accounts: Account[]) => {
    setCheckedIds(accounts.map(a => a.id));
  }, []);

  const handleUnselectAll = useCallback(() => {
    setCheckedIds([]);
  }, []);

  const toggleAccount = useCallback((account: Account) => {
    setCheckedIds(prevState => {
      if (prevState.includes(account.id)) {
        return [...prevState].filter(id => id !== account.id);
      }
      return [...prevState, account.id];
    });
  }, []);

  const ContinueButton = () => (
    <Button
      disabled={!checkedIds.length}
      data-e2e="continue_button"
      onClick={handleContinueButtonClick}
      event={"Operation history"}
      variant="main"
    >
      <Trans i18nKey="exportOperationsModal.cta" />
    </Button>
  );

  const DoneButton = () => (
    <Button data-e2e="continue_button" onClick={onClose} variant="main">
      <Trans i18nKey="exportOperationsModal.ctaSuccess" />
    </Button>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      backgroundColor={success ? "success.c100" : undefined}
      big
      footer={
        success ? null : (
          <Flex justifyContent="flex-end" flexGrow={1} alignItems="flex-end">
            <ContinueButton />
          </Flex>
        )
      }
    >
      <Flex flexDirection="column" rowGap={6} flexGrow={1} height="100%">
        {success ? (
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            px={15}
          >
            <Icons.CircledCheckUltraLight size="72px" color="palette.neutral.c100" />
            <Log mt={12} px={8}>
              <Trans i18nKey="exportOperationsModal.titleSuccess" />
            </Log>
            <Text
              variant="paragraph"
              color="palette.neutral.c100"
              mt={7}
              mb={12}
              textAlign="center"
            >
              <Trans i18nKey="exportOperationsModal.descSuccess" />
            </Text>
            <DoneButton />
          </Flex>
        ) : (
          <>
            <Text mb={12} alignSelf="center" variant="h3" color="palette.neutral.c100">
              <Trans i18nKey="exportOperationsModal.title" />
            </Text>
            <Flex flexDirection="column">
              <div style={{ marginBottom: "20px" }}>
                <Alert type="warning" title={t("exportOperationsModal.disclaimer")} />
              </div>
              <AccountsList
                emptyText={<Trans i18nKey="exportOperationsModal.noAccounts" />}
                title={
                  <>
                    <Trans i18nKey="exportOperationsModal.selectedAccounts" />
                    {checkedIds.length > 0 ? ` (${checkedIds.length})` : ""}
                  </>
                }
                subtitle={<Trans i18nKey="exportOperationsModal.desc" />}
                accounts={accounts}
                onSelectAll={accounts.length > 1 ? handleSelectAll : undefined}
                onUnselectAll={accounts.length > 1 ? handleUnselectAll : undefined}
                onToggleAccount={toggleAccount}
                checkedIds={checkedIds}
              />
            </Flex>
          </>
        )}
      </Flex>
    </Drawer>
  );
};

export default ExportOperations;
