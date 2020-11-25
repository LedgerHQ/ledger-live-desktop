// @flow
import React, { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import type { CurrentRate } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import EmptyState from "./EmptyState";
import ActiveAccounts from "./ActiveAccounts";
import Rates from "./Rates";
import { openModal } from "~/renderer/actions/modals";
import { isAcceptedLendingTerms } from "~/renderer/terms";

const Dashboard = ({
  summaries,
  rates,
}: {
  summaries: CompoundAccountSummary[],
  rates: CurrentRate[],
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const isAcceptedTerms = isAcceptedLendingTerms();

  // handle backdrop closing of modal in context of not accepting terms of lending
  const onCloseTermsModal = useCallback(() => {
    const hasAcceptedTerms = isAcceptedLendingTerms();
    !hasAcceptedTerms && history.goBack();
  }, [history]);

  // if user has not accepted terms of lending show terms modal
  useEffect(() => {
    !isAcceptedTerms &&
      dispatch(openModal("MODAL_LEND_ENABLE_INFO", { onClose: onCloseTermsModal }));
  }, [dispatch, isAcceptedTerms, onCloseTermsModal]);

  return (
    <Box>
      {isAcceptedTerms ? <TrackPage category="Lend" name="Dashboard" /> : null}
      <Text ff="Inter|SemiBold" color="palette.text.shade100">
        {t("lend.assets")}
      </Text>
      <Box my={4}>
        <Rates rates={rates} />
      </Box>
      <Text ff="Inter|SemiBold" color="palette.text.shade100">
        {t("lend.active")}
      </Text>
      <Box my={4}>
        {summaries.length > 0 ? <ActiveAccounts summaries={summaries} /> : <EmptyState />}
      </Box>
    </Box>
  );
};

export default Dashboard;
