// @flow
import React, { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import TrackPage from "~/renderer/analytics/TrackPage";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import { closeModal } from "~/renderer/actions/modals";
import useTheme from "~/renderer/hooks/useTheme";
import styled from "styled-components";
import IconChevronRight from "~/renderer/icons/ChevronRight";

import install from "~/renderer/components/ProductTour/assets/install-done.png";
import createAccount from "~/renderer/components/ProductTour/assets/create-done.png";
import receive from "~/renderer/components/ProductTour/assets/receive-done.png";
import send from "~/renderer/components/ProductTour/assets/send-done.png";
import swap from "~/renderer/components/ProductTour/assets/swap-done.png";
import buy from "~/renderer/components/ProductTour/assets/buy-done.png";
import customize from "~/renderer/components/ProductTour/assets/customize-done.png";

const Illustration = styled.img`
  width: 200px;
  height: auto;
`;

const illustrations = {
  install,
  createAccount,
  receive,
  send,
  swap,
  buy,
  customize,
};

type Props = {
  isOpened?: boolean,
  activeFlow: string,
  extras?: {
    congratulationsCallback?: () => void,
    swapId?: string,
    currencyName?: string,
  },
};

const ProductTourModal = ({ isOpened, extras, activeFlow }: Props) => {
  // eslint-disable-next-line no-unused-vars
  const { state, send } = useContext(ProductTourContext);
  const theme = useTheme();
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    send("CLOSE");
    dispatch(closeModal("MODAL_PRODUCT_TOUR_SUCCESS"));
  }, [dispatch, send]);

  const wrappedCallback = useCallback(() => {
    extras?.congratulationsCallback && extras.congratulationsCallback();
    onClose();
  }, [extras, onClose]);

  return (
    <Modal
      style={{ backgroundColor: theme.colors.identity }}
      name={"MODAL_PRODUCT_TOUR_SUCCESS"}
      centered
      preventBackdropClick
    >
      <TrackPage category="Modal" name="ProductTourModalCompletedFlow" activeFlow={activeFlow} />
      <ModalBody
        width={700}
        render={() => (
          <Box alignItems="center" color={"white"}>
            <Illustration src={illustrations[activeFlow]} />
            <Text ff={"Inter|SemiBold"} fontSize={28}>
              <Trans i18nKey={`productTour.flows.${activeFlow}.completed`} />
            </Text>
            <Text px={60} mt={2} ff={"Inter|Regular"} textAlign={"center"} fontSize={14}>
              <Trans i18nKey={`productTour.flows.${activeFlow}.congratulations`} values={extras} />
            </Text>
            <Box horizontal mt={3}>
              {extras?.congratulationsCallback ? (
                <Button secondary mr={3} outline outlineColor="white" onClick={wrappedCallback}>
                  <Text>
                    <Trans i18nKey={`productTour.flows.${activeFlow}.secondaryCTA`} />
                  </Text>
                </Button>
              ) : null}
              <Button primary inverted onClick={onClose}>
                <Box alignItems="center" color={"black"} horizontal>
                  <Text mr={2}>
                    <Trans i18nKey={`common.continue`} />
                  </Text>
                  <IconChevronRight color={"black"} size={13} />
                </Box>
              </Button>
            </Box>
          </Box>
        )}
      />
    </Modal>
  );
};

export default ProductTourModal;
