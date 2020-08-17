// @flow

import { remote, ipcRenderer } from "electron";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "~/renderer/components/Box/Card";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import OperationRow from "~/renderer/screens/swap/History/OperationRow";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/swap/getCompleteSwapHistory";
import updateAccountSwapStatus from "@ledgerhq/live-common/lib/swap/updateAccountSwapStatus";
import { mappedSwapOperationsToCSV } from "@ledgerhq/live-common/lib/swap/csvExport";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { FakeLink } from "~/renderer/components/Link";
import moment from "moment";
import Spinner from "~/renderer/components/Spinner";
import styled from "styled-components";
import IconDownloadCloud from "~/renderer/icons/DownloadCloud";

const ExportOperationsWrapper = styled(Box)`
  color: ${p => p.theme.colors.palette.primary.main};
  align-items: center;
  margin-top: -40px;
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
  const accounts = useSelector(shallowAccountsSelector);
  const [exporting, setExporting] = useState(false);
  const [mappedSwapOperations, setMappedSwapOperations] = useState(null);
  const dispatch = useDispatch();
  const accountsRef = useRef(accounts);

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
    accountsRef.current = accounts;
  }, [accounts]);

  useEffect(() => {
    (async function asyncGetCompleteSwapHistory() {
      setMappedSwapOperations(await getCompleteSwapHistory(accounts));
    })();
  }, [accounts]);

  useEffect(() => {
    (async function asyncUpdateAccountSwapStatus() {
      if (!accountsRef.current) return;
      const newAccounts = await Promise.all(accountsRef.current.map(updateAccountSwapStatus));
      newAccounts.forEach(account => dispatch(updateAccountWithUpdater(account.id, a => account)));
    })();
  }, [dispatch]);

  const openSwapOperationDetailsModal = useCallback(
    mappedSwapOperation =>
      dispatch(openModal("MODAL_SWAP_OPERATION_DETAILS", { mappedSwapOperation })),
    [dispatch],
  );

  return (
    <>
      <Box horizontal flow={2} alignItems="center" justifyContent="flex-end">
        <ExportOperationsWrapper horizontal>
          <IconDownloadCloud size={16} />
          <Text ml={1} ff="Inter|Regular" fontSize={3}>
            <FakeLink onClick={exporting ? undefined : onExportOperations}>
              {exporting ? "Exporting..." : "Export operations"}
            </FakeLink>
          </Text>
        </ExportOperationsWrapper>
      </Box>
      {mappedSwapOperations ? (
        mappedSwapOperations.length ? (
          mappedSwapOperations.map(section => (
            // Sections?
            <>
              <Box mb={2} mt={4} ff="Inter|SemiBold" fontSize={4} color="palette.text.shade60">
                {moment(section.day).calendar(null, {
                  sameDay: "LL – [Today]",
                  lastDay: "LL – [Yesterday]",
                  lastWeek: "LL",
                  sameElse: "LL",
                })}
              </Box>
              <Card key={section.day.toString()}>
                {section.data.map(mappedSwapOperation => (
                  <OperationRow
                    key={mappedSwapOperation.swapId}
                    mappedSwapOperation={mappedSwapOperation}
                    openSwapOperationDetailsModal={openSwapOperationDetailsModal}
                  />
                ))}
              </Card>
            </>
          ))
        ) : (
          <Box p={150} alignItems={"center"} justifyContent={"center"}>
            <Text mb={1} ff="Inter|SemiBold" fontSize={16} color="palette.text.shade100">
              {"No History"}
            </Text>
            <Text ff="Inter|Regular" fontSize={12} color="palette.text.shade50">
              {"You don’t have any history swap"}
            </Text>
          </Box>
        )
      ) : (
        <Card
          px={80}
          py={53}
          alignItems={"center"}
          justifyContent={"center"}
          style={{ minHeight: 438 }}
        >
          <Spinner size={40} />
        </Card>
      )}
    </>
  );
};

export default History;
