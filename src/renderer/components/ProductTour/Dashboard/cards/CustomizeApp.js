// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import { useHistory } from "react-router-dom";

import customize from "~/renderer/components/ProductTour/assets/customize.png";

const Customize = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onBeforeFlow = useCallback(() => {
    dispatch(openModal("MODAL_PRODUCT_TOUR_CUSTOMIZATION"));
  }, [dispatch]);

  const onAfterFlow = useCallback(() => {
    // NB Ensure we go back to the portfolio after a flow
    history.push({ pathname: "/" });
  }, [history]);

  return (
    <Card
      appFlow={"customize"}
      title={<Trans i18nKey={"productTour.flows.customize.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.customize.completedCard"} />}
      controlledModals={["MODAL_PRODUCT_TOUR_CUSTOMIZATION"]}
      illustration={customize}
      overrideContent
      onBeforeFlow={onBeforeFlow}
      onAfterFlow={onAfterFlow}
    />
  );
};

export default Customize;
