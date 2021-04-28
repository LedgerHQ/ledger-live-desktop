// @flow

import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TabBar from "~/renderer/components/TabBar";
import Box from "~/renderer/components/Box";
import History from "~/renderer/screens/exchange/swap/History";
import Form from "~/renderer/screens/exchange/swap/Form";
import KYC from "~/renderer/screens/exchange/swap/KYC";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import TrackPage from "~/renderer/analytics/TrackPage";

type Props = {
  providers: any,
  provider: string,
};

const Swap = ({ providers, provider }: Props) => {
  const [tabIndex, setTabIndex] = useState(0);

  const { t } = useTranslation();
  const history = useHistory();
  const swapKYC = useSelector(swapKYCSelector);
  const showWyreKYC = provider === "wyre" && swapKYC?.wyre?.status !== "approved";

  const onKYCCompleted = useCallback(() => {
    history.push("/swap");
  }, [history]);

  return (
    <Box flex={1} pb={6}>
      <TrackPage category="Swap" />
      <Box horizontal>
        <Box
          grow
          ff="Inter|SemiBold"
          fontSize={7}
          mb={provider ? 3 : 0}
          color="palette.text.shade100"
          data-e2e="swapPage_title"
        >
          <Trans i18nKey="swap.title" />
        </Box>
      </Box>
      <TabBar
        tabs={[t("swap.tabs.exchange"), t("swap.tabs.history")]}
        onIndexChange={setTabIndex}
        index={tabIndex}
      />
      {tabIndex === 0 ? (
        showWyreKYC ? (
          <KYC onContinue={onKYCCompleted} />
        ) : (
          <Form providers={providers} provider={provider} setTabIndex={setTabIndex} />
        )
      ) : (
        <History />
      )}
    </Box>
  );
};

export default Swap;
