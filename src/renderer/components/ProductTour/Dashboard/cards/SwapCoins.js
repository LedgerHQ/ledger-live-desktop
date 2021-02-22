// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import swap from "~/renderer/components/ProductTour/assets/swap.png";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import { useOnSetOverlays } from "~/renderer/components/ProductTour/hooks";

const SwapCrypto = () => {
  const history = useHistory();

  const onBeforeFlow = useOnSetOverlays({
    selector: "#drawer-swap-button",
    i18nKey: "productTour.flows.swap.overlays.sidebar",
    config: { bottom: true, withFeedback: true },
  });

  const onAfterFlow = useCallback(() => {
    // NB Ensure we go back to the portfolio after a flow
    history.push({ pathname: "/" });
  }, [history]);

  const onLearnMore = useCallback(() => {
    openURL(urls.productTour.swap);
  }, []);

  return (
    <Card
      appFlow={"swap"}
      require={"createAccount"}
      title={<Trans i18nKey={"productTour.flows.swap.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.swap.completedCard"} />}
      illustration={swap}
      onBeforeFlow={onBeforeFlow}
      onAfterFlow={onAfterFlow}
      learnMoreCallback={onLearnMore}
    />
  );
};

export default SwapCrypto;
