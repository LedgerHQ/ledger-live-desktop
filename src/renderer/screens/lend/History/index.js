// @flow
import React from "react";
import { useTranslation } from "react-i18next";
// import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import Box from "~/renderer/components/Box";
import EmptyState from "../EmptyState";

const History = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <EmptyState
        title={t("lend.emptyState.history.title")}
        description={t("lend.emptyState.history.description")}
        buttonLabel={t("lend.emptyState.history.cta")}
        onClick={() => {}}
      />
    </Box>
  );
};

export default History;
