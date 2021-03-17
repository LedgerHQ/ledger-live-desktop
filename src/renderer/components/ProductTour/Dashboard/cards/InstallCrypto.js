// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import install from "~/renderer/components/ProductTour/assets/install.png";
import { useOnSetOverlays } from "~/renderer/components/ProductTour/hooks";

const InstallCrypto = () => {
  const history = useHistory();

  const onBeforeFlow = useOnSetOverlays({
    selector: ["#drawer-manager-button", "#drawer-exchange-button"],
    i18nKey: "productTour.flows.install.overlays.sidebar",
    config: { bottom: true, withFeedback: true },
  });
  const onAfterFlow = useCallback(() => {
    // NB Ensure we go back to the portfolio after a flow
    history.push({ pathname: "/" });
  }, [history]);
  const onLearnMore = useCallback(() => {
    openURL(urls.productTour.install);
  }, []);

  return (
    <Card
      appFlow={"install"}
      title={<Trans i18nKey={"productTour.flows.install.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.install.completedCard"} />}
      illustration={install}
      onBeforeFlow={onBeforeFlow}
      learnMoreCallback={onLearnMore}
      onAfterFlow={onAfterFlow}
    />
  );
};

export default InstallCrypto;
