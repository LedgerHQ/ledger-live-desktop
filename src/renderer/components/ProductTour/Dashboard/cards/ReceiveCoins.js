// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import receive from "~/renderer/components/ProductTour/assets/receive.png";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import { useOnSetOverlays } from "~/renderer/components/ProductTour/hooks";

const ReceiveCrypto = () => {
  const history = useHistory();

  const onSetOverlays = useOnSetOverlays({
    selector: "#drawer-receive-button",
    i18nKey: "productTour.flows.receive.overlays.sidebar",
    config: { bottom: true, withFeedback: true },
  });

  const onBeforeFlow = useCallback(() => {
    history.push({ pathname: "/" });
    onSetOverlays();
  }, [history, onSetOverlays]);

  const onAfterFlow = useCallback(() => {
    history.push({ pathname: "/" });
  }, [history]);

  const onLearnMore = useCallback(() => {
    openURL(urls.productTour.receive);
  }, []);

  return (
    <Card
      require={"createAccount"}
      appFlow={"receive"}
      controlledModals={["MODAL_RECEIVE"]}
      title={<Trans i18nKey={"productTour.flows.receive.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.receive.completedCard"} />}
      illustration={receive}
      onBeforeFlow={onBeforeFlow}
      onAfterFlow={onAfterFlow}
      learnMoreCallback={onLearnMore}
    />
  );
};

export default ReceiveCrypto;
