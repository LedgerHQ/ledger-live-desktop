// @flow

import React, { useCallback, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import TabBar from "~/renderer/components/TabBar";
import Alert from "~/renderer/components/Alert";
import Swap from "~/renderer/screens/exchange/swap/Swap";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import FakeLink from "~/renderer/components/FakeLink";
import { Trans, useTranslation } from "react-i18next";
import History from "~/renderer/screens/exchange/swap/History";

const ExchangeTabContent = props => <Swap {...props} />;
const HistoryTabContent = props => <History />;

const tabs = [
  {
    title: "swap.tabs.exchange",
    Component: ExchangeTabContent,
  },
  {
    title: "swap.tabs.history",
    Component: HistoryTabContent,
  },
];

const FormOrHistory = () => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();
  const history = useHistory();

  const Component = tabs[tabIndex].Component;
  const onOpenParaswap = useCallback(() => {
    history.push("/platform/paraswap");
  }, [history]);

  return (
    <Box flex={1} pb={6}>
      <TrackPage category="Swap" />
      <Box horizontal mb={2}>
        <Box
          grow
          ff="Inter|SemiBold"
          fontSize={7}
          color="palette.text.shade100"
          data-e2e="swapPage_title"
        >
          <Trans i18nKey="swap.title" />
        </Box>
      </Box>
      <Alert
        type={"hint"}
        onLearnMore={onOpenParaswap}
        learnMoreIsInternal
        learnMoreLabel={<Trans i18nKey="swap.paraswap.cta" />}
      >
        <Text ff="Inter|Regular" fontSize={4}>
          <Trans i18nKey="swap.paraswap.description" />
        </Text>
      </Alert>
      <TabBar tabs={tabs.map(tab => t(tab.title))} onIndexChange={setTabIndex} index={tabIndex} />
      <Component {...location?.state} setTabIndex={setTabIndex} />
    </Box>
  );
};

export default FormOrHistory;
