// @flow

import { remote, ipcRenderer } from "electron";
import React, { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { accountsSelector } from "~/renderer/reducers/accounts";
import OperationRow from "~/renderer/screens/exchange/swap/History/OperationRow";
import { operationStatusList } from "@ledgerhq/live-common/lib/exchange/swap";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/exchange/swap/getCompleteSwapHistory";
import updateAccountSwapStatus from "@ledgerhq/live-common/lib/exchange/swap/updateAccountSwapStatus";
import type { SwapHistorySection } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { flattenAccounts } from "@ledgerhq/live-common/lib/account";
import { mappedSwapOperationsToCSV } from "@ledgerhq/live-common/lib/exchange/swap/csvExport";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import useInterval from "~/renderer/hooks/useInterval";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Alert from "~/renderer/components/Alert";
import SectionTitle from "~/renderer/components/OperationsList/SectionTitle";
import { FakeLink } from "~/renderer/components/Link";
import moment from "moment";
import styled from "styled-components";
import IconDownloadCloud from "~/renderer/icons/DownloadCloud";
import { setDrawer } from "~/renderer/drawers/Provider";
import SwapOperationDetails from "~/renderer/drawers/SwapOperationDetails";
import HistoryLoading from "./HistoryLoading";
import HistoryPlaceholder from "./HistoryPlaceholder";
import { useHistory } from "react-router-dom";
import TrackPage from "~/renderer/analytics/TrackPage";

const Head = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
`;

const ExportOperationsWrapper = styled(Box)`
  color: ${p => p.theme.colors.palette.primary.main};
  align-items: center;
  z-index: 10;
`;

const exportOperations = async (
  path: { canceled: boolean, filePath: string },
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

const History = () => {
  const accounts = useSelector(accountsSelector);
  const [exporting, setExporting] = useState(false);
  const [mappedSwapOperations, setMappedSwapOperations] = useState<?(SwapHistorySection[])>(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const defaultOpenedOnce = useRef(false);
  const defaultOpenedSwapOperationId = history?.location?.state?.swapId;

  const onExportOperations = useCallback(() => {
    async function asyncExport() {
      const path = await remote.dialog.showSaveDialog({
        title: "Exported swap history",
        defaultPath: `ledgerlive-swap-history-${moment().format("YYYY.MM.DD")}.csv`,
        filters: [
          {
            name: "All Files",
            extensions: ["csv"],
          },
        ],
      });

      if (path && mappedSwapOperations) {
        exportOperations(path, mappedSwapOperationsToCSV(mappedSwapOperations), () =>
          setExporting(false),
        );
      }
    }
    if (!exporting) {
      asyncExport()
        .catch(e => {
          console.log({ e });
        })
        .then(() => {
          setExporting(false);
        });
    }
  }, [exporting, mappedSwapOperations]);

  useEffect(() => {
    (async function asyncGetCompleteSwapHistory() {
      if (!accounts) return;
      const sections = await getCompleteSwapHistory(flattenAccounts(accounts));
      setMappedSwapOperations(sections);
    })();
  }, [accounts]);

  useEffect(() => {
    if (defaultOpenedOnce.current || !defaultOpenedSwapOperationId) return;
    if (mappedSwapOperations) {
      defaultOpenedOnce.current = true;
      mappedSwapOperations.some(section => {
        const openedOperation = section.data.find(
          ({ swapId }) => swapId === defaultOpenedSwapOperationId,
        );
        if (openedOperation) {
          setDrawer(SwapOperationDetails, { mappedSwapOperation: openedOperation });
        }
        return !!openedOperation;
      });
    }
  }, [mappedSwapOperations, defaultOpenedSwapOperationId]);

  const updateSwapStatus = useCallback(() => {
    let cancelled = false;
    async function fetchUpdatedSwapStatus() {
      const updatedAccounts = await Promise.all(accounts.map(updateAccountSwapStatus));
      if (!cancelled) {
        updatedAccounts.filter(Boolean).forEach(account => {
          dispatch(updateAccountWithUpdater(account.id, a => account));
        });
      }
    }

    fetchUpdatedSwapStatus();
    return () => (cancelled = true);
  }, [accounts, dispatch]);

  const hasPendingSwapOperations = useMemo(() => {
    if (mappedSwapOperations) {
      for (const section of mappedSwapOperations) {
        for (const swapOperation of section.data) {
          if (operationStatusList.pending.includes(swapOperation.status)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [mappedSwapOperations]);

  useInterval(() => {
    if (hasPendingSwapOperations) {
      updateSwapStatus();
    }
  }, 10000);

  const openSwapOperationDetailsModal = useCallback(
    mappedSwapOperation => setDrawer(SwapOperationDetails, { mappedSwapOperation }),
    [],
  );

  return (
    <>
      <TrackPage category="Swap" name="Device History" />
      <Box p={20}>
        <Box horizontal flow={2} alignItems="center" justifyContent="flex-end">
          <ExportOperationsWrapper horizontal>
            <IconDownloadCloud size={16} />
            <Text ml={1} ff="Inter|Regular" fontSize={3}>
              <FakeLink onClick={exporting ? undefined : onExportOperations}>
                {exporting ? t("swap2.history.exporting") : t("swap2.history.export")}
              </FakeLink>
            </Text>
          </ExportOperationsWrapper>
        </Box>
        {mappedSwapOperations ? (
          mappedSwapOperations.length ? (
            <Box>
              <Head px={20} py={16}>
                <Alert type="primary">{t("swap2.history.disclaimer")}</Alert>
              </Head>
              {mappedSwapOperations.map(section => (
                <>
                  <SectionTitle day={section.day} />
                  <Box>
                    {section.data.map(mappedSwapOperation => (
                      <OperationRow
                        key={mappedSwapOperation.swapId}
                        mappedSwapOperation={mappedSwapOperation}
                        openSwapOperationDetailsModal={openSwapOperationDetailsModal}
                      />
                    ))}
                  </Box>
                </>
              ))}
            </Box>
          ) : (
            <HistoryPlaceholder />
          )
        ) : (
          <HistoryLoading />
        )}
      </Box>
    </>
  );
};

export default History;
