// @flow
import React, { useContext, useMemo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import TrackPage from "~/renderer/analytics/TrackPage";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { closeModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { Trans } from "react-i18next";
import ThemeStep from "./steps/ThemeStep";
import PasswordStep from "./steps/PasswordStep";
import CounterValueStep from "./steps/CounterValueStep";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";

type Props = {
  isOpened?: boolean,
};
const ModalCustomization = ({ isOpened }: Props) => {
  const dispatch = useDispatch();
  const steps = useMemo(() => ["theme", "password", "countervalue"], []);
  const [activeStep, setActiveStep] = useState("theme");
  const [canContinue, setCanContinue] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { state, send } = useContext(ProductTourContext);

  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_PRODUCT_TOUR_CUSTOMIZATION"));
  }, [dispatch]);

  const onNext = useCallback(() => {
    const nextStep = steps.indexOf(activeStep) + 1;
    if (nextStep >= steps.length) {
      send("COMPLETE_FLOW");
      onClose();
    } else {
      setActiveStep(steps[nextStep]);
      setCanContinue(false);
    }
  }, [activeStep, onClose, send, steps]);

  const onBack = useCallback(() => {
    const prevStep = steps.indexOf(activeStep) - 1;
    if (prevStep >= 0) {
      setActiveStep(steps[prevStep]);
    }
  }, [activeStep, steps]);

  return (
    <Modal name={"MODAL_PRODUCT_TOUR_CUSTOMIZATION"} centered preventBackdropClick>
      <TrackPage category="Modal" name="ProductTourModalCustomization" />
      <ModalBody
        onClose={onClose}
        title={<Trans i18nKey={`productTour.flows.customize.modal.${activeStep}.title`} />}
        onBack={onBack}
        showProductTourBack={activeStep === "theme"}
        render={() =>
          activeStep === "theme" ? (
            <ThemeStep onNext={onNext} setCanContinue={setCanContinue} />
          ) : activeStep === "password" ? (
            <PasswordStep onNext={onNext} setCanContinue={setCanContinue} />
          ) : (
            <CounterValueStep setCanContinue={setCanContinue} />
          )
        }
        renderFooter={() => (
          <Box>
            <Button primary disabled={!canContinue} onClick={onNext}>
              <Trans i18nKey="common.continue" />
            </Button>
          </Box>
        )}
      />
    </Modal>
  );
};

export default ModalCustomization;
