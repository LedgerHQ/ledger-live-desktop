// @flow
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import TrackPage from "~/renderer/analytics/TrackPage";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import { closeModal } from "~/renderer/actions/modals";
import styled from "styled-components";
import IconLock from "~/renderer/icons/Lock";

const IconWrapper = styled.div`
  background: ${p => p.theme.colors.pillActiveBackground};
  color: ${p => p.theme.colors.wallet};
  height: 50px;
  width: 50px;
  border-radius: 50px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

type Props = {
  isOpened?: boolean,
};

const ModalUnavailable = ({ isOpened }: Props) => {
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_PRODUCT_TOUR_UNAVAILABLE"));
  }, [dispatch]);

  return (
    <Modal name={"MODAL_PRODUCT_TOUR_UNAVAILABLE"} centered preventBackdropClick>
      <TrackPage category="Modal" name="ProductTourModalUnavailable" />
      <ModalBody
        onClose={onClose}
        render={() => (
          <Box alignItems="center">
            <IconWrapper>
              <IconLock size={20} />
            </IconWrapper>
            <Text ff={"Inter|SemiBold"} mt={3} fontSize={18} color={"palette.text.shade100"}>
              <Trans i18nKey={"productTour.modalUnavailable.title"} />
            </Text>
            <Text
              px={100}
              mt={2}
              ff={"Inter|Regular"}
              textAlign={"center"}
              fontSize={13}
              color={"palette.text.shade100"}
            >
              <Trans i18nKey={"productTour.modalUnavailable.subtitle"} />
            </Text>
            <Button mt={3} primary onClick={onClose}>
              <Text>
                <Trans i18nKey={"productTour.modalUnavailable.cta"} />
              </Text>
            </Button>
          </Box>
        )}
      />
    </Modal>
  );
};

export default ModalUnavailable;
