// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import receive from "~/renderer/components/ProductTour/assets/receive.png";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

const ReceiveCrypto = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onBeforeReceiveFlow = useCallback(() => {
    dispatch(openModal("MODAL_RECEIVE"));
  }, [dispatch]);

  const onAfterFlow = useCallback(() => {
    // NB Ensure we go back to the portfolio after a flow
    history.push({ pathname: "/" });
  }, [history]);

  const onLearnMore = useCallback(() => {
    openURL(urls.productTour.receive);
  }, []);

  return (
    <Card
      require={"createAccount"}
      appFlow={"receive"}
      overrideContent
      controlledModals={["MODAL_RECEIVE"]}
      title={<Trans i18nKey={"productTour.flows.receive.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.receive.completedCard"} />}
      illustration={receive}
      onBeforeFlow={onBeforeReceiveFlow}
      onAfterFlow={onAfterFlow}
      learnMoreCallback={onLearnMore}
    />
  );
};

export default ReceiveCrypto;
