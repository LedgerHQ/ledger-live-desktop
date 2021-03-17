// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/ProductTour/Dashboard/Card";
import { useHistory } from "react-router-dom";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import create from "~/renderer/components/ProductTour/assets/create.png";
import { useOnSetOverlays } from "~/renderer/components/ProductTour/hooks";

const CreateAccount = () => {
  const history = useHistory();
  const onBeforeFlow = useOnSetOverlays({
    selector: "#drawer-accounts-button",
    i18nKey: "productTour.flows.createAccount.overlays.sidebar",
    config: { withFeedback: true },
  });

  const onAfterFlow = useCallback(() => {
    // NB Ensure we go back to the portfolio after a flow
    history.push({ pathname: "/" });
  }, [history]);

  const onLearnMore = useCallback(() => {
    openURL(urls.productTour.createAccount);
  }, []);

  return (
    <Card
      require={"install"}
      appFlow={"createAccount"}
      title={<Trans i18nKey={"productTour.flows.createAccount.pending"} />}
      titleCompleted={<Trans i18nKey={"productTour.flows.createAccount.completedCard"} />}
      controlledModals={["MODAL_ADD_ACCOUNTS"]}
      illustration={create}
      onBeforeFlow={() => {
        history.push({ pathname: "/" });
        onBeforeFlow();
      }}
      onAfterFlow={onAfterFlow}
      learnMoreCallback={onLearnMore}
    />
  );
};

export default CreateAccount;
