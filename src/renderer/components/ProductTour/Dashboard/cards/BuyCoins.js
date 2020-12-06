// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import buy from "~/renderer/components/ProductTour/assets/buy.png";

const BuyCrypto = () => {
  const history = useHistory();

  const onBeforeFlow = useCallback(() => {
    history.push({ pathname: "/exchange" });
  }, [history]);

  const onAfterFlow = useCallback(() => {
    // NB Ensure we go back to the portfolio after a flow
    history.push({ pathname: "/" });
  }, [history]);

  const onLearnMore = useCallback(() => {
    openURL(urls.productTour.buy);
  }, []);

  return (
    <Card
      appFlow={"buy"}
      require={"install"}
      title={<Trans i18nKey={"productTour.flows.buy.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.buy.completedCard"} />}
      illustration={buy}
      onBeforeFlow={onBeforeFlow}
      onAfterFlow={onAfterFlow}
      learnMoreCallback={onLearnMore}
    />
  );
};

export default BuyCrypto;
