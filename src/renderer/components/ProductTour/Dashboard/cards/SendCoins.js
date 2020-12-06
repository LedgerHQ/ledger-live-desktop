// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import send from "~/renderer/components/ProductTour/assets/send.png";

const SendCrypto = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onBeforeSendFlow = useCallback(() => {
    dispatch(openModal("MODAL_SEND"));
  }, [dispatch]);

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
      require={"createAccount"}
      overrideContent
      controlledModals={["MODAL_SEND"]}
      title={<Trans i18nKey={"productTour.flows.send.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.send.completedCard"} />}
      illustration={send}
      onBeforeFlow={onBeforeSendFlow}
      onAfterFlow={onAfterFlow}
      learnMoreCallback={onLearnMore}
    />
  );
};

export default SendCrypto;
