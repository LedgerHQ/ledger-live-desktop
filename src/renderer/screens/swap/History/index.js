// @flow

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "~/renderer/components/Box/Card";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import OperationRow from "~/renderer/screens/swap/History/OperationRow";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/swap/getCompleteSwapHistory";
import updateAccountSwapStatus from "@ledgerhq/live-common/lib/swap/updateAccountSwapStatus";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";

const History = () => {
  const accounts = useSelector(shallowAccountsSelector);
  const [mappedSwapOperations, setMappedSwapOperations] = useState([]);
  const dispatch = useDispatch();
  const accountsRef = useRef(accounts);

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
    <Card>
      {mappedSwapOperations && mappedSwapOperations.length ? (
        mappedSwapOperations.map(section =>
          // Sections?
          section.data.map(mappedSwapOperation => (
            <OperationRow
              key={mappedSwapOperation.swapId}
              date={section.day}
              mappedSwapOperation={mappedSwapOperation}
              openSwapOperationDetailsModal={openSwapOperationDetailsModal}
            />
          )),
        )
      ) : (
        <Box p={150} alignItems={"center"} justifyContent={"center"}>
          <Text mb={1} ff="Inter|SemiBold" fontSize={16} color="palette.text.shade100">
            {"No History"}
          </Text>
          <Text ff="Inter|Regular" fontSize={12} color="palette.text.shade50">
            {"You don’t have any history swap"}
          </Text>
        </Box>
      )}
    </Card>
  );
};

export default History;
