// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import send from "~/renderer/components/ProductTour/assets/send.png";
import { useOnSetOverlays } from "~/renderer/components/ProductTour/hooks";

const SendCrypto = () => {
  const history = useHistory();

  const onSetOverlays = useOnSetOverlays({
    selector: "#drawer-send-button",
    i18nKey: "productTour.flows.send.overlays.sidebar",
    config: { bottom: true, withFeedback: true },
  });

  const onBeforeFlow = useCallback(() => {
    onSetOverlays();
    history.push({ pathname: "/" });
  }, [history, onSetOverlays]);

  const onAfterFlow = useCallback(() => {
    // NB Ensure we go back to the portfolio after a flow
    history.push({ pathname: "/" });
  }, [history]);

  const onLearnMore = useCallback(() => {
    openURL(urls.productTour.send);
  }, []);

  return (
    <Card
      appFlow={"send"}
      // require={"createAccount"}
      controlledModals={["MODAL_SEND"]}
      title={<Trans i18nKey={"productTour.flows.send.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.send.completedCard"} />}
      illustration={send}
      onBeforeFlow={onBeforeFlow}
      onAfterFlow={onAfterFlow}
      learnMoreCallback={onLearnMore}
    />
  );
};

export default SendCrypto;
