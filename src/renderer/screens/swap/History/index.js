// @flow

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "~/renderer/components/Box/Card";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import OperationRow from "~/renderer/screens/swap/History/OperationRow";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/swap/getCompleteSwapHistory";
import { openModal } from "~/renderer/actions/modals";

const History = () => {
  const accounts = useSelector(shallowAccountsSelector);
  const [mappedSwapOperations, setMappedSwapOperations] = useState([]);
  const reduxDispatch = useDispatch();

  const openSwapOperationDetailsModal = useCallback(
    mappedSwapOperation =>
      reduxDispatch(openModal("MODAL_SWAP_OPERATION_DETAILS", { mappedSwapOperation })),
    [reduxDispatch],
  );

  useEffect(() => {
    (async function asyncGetCompleteSwapHistory() {
      // FIXME I dont like this
      setMappedSwapOperations(await getCompleteSwapHistory(accounts, true));
      setMappedSwapOperations(await getCompleteSwapHistory(accounts));
    })();
  }, [accounts]);

  return (
    <Card>
      {mappedSwapOperations.map(mappedSwapOperation => (
        <OperationRow
          key={mappedSwapOperation.swapId}
          mappedSwapOperation={mappedSwapOperation}
          openSwapOperationDetailsModal={openSwapOperationDetailsModal}
        />
      ))}
    </Card>
  );
};

export default History;
