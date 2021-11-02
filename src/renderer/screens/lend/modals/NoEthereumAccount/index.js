// @flow
import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { closeModal, openModal } from "~/renderer/actions/modals";

import AmountUp from "~/renderer/icons/AmountUp";
import Modal, { ModalBody } from "~/renderer/components/Modal/index";
import Box from "~/renderer/components/Box/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

const AmountUpWrapper = styled.div`
  padding: ${p => p.theme.space[3]}px;
  box-sizing: content-box;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  color: ${p => p.theme.colors.wallet};
  background-color: ${p => p.theme.colors.blueTransparentBackground};
`;

type Props = {
  currency: TokenCurrency,
  ...
};

const NoEthereumAccountModal = ({ currency, ...rest }: Props) => {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(closeModal("MODAL_LEND_NO_ETHEREUM_ACCOUNT"));
  }, [dispatch]);

  const handleAddAccount = useCallback(() => {
    handleClose();
    dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency, flow: "lend" }));
  }, [dispatch, handleClose, currency]);

  return (
    <Modal
      {...rest}
      name="MODAL_LEND_NO_ETHEREUM_ACCOUNT"
      centered
      onBack={undefined}
      onClose={handleClose}
      preventBackdropClick={false}
      render={({ onClose, data }) => (
        <ModalBody
          title={<Trans i18nKey="lend.title" />}
          noScroll
          render={onClose => (
            <Box flow={4}>
              <Box alignItems="center">
                <AmountUpWrapper>
                  <AmountUp size={24} />
                </AmountUpWrapper>
                <Text ff="Inter|Bold" my={3} fontSize={4} textAlign="center">
                  <Trans i18nKey="lend.noEthAccount.title" />
                </Text>
                <Text ff="Inter|Regular" fontSize={4} textAlign="center">
                  <Trans
                    i18nKey="lend.noEthAccount.description"
                    values={{ asset: currency.name, ticker: currency.ticker }}
                  >
                    <b></b>
                  </Trans>
                </Text>
              </Box>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal flex="1 1 0%">
              <Box grow />
              <Button primary onClick={handleAddAccount}>
                <Trans i18nKey="lend.noEthAccount.cta" />
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
};

export default memo<Props>(NoEthereumAccountModal);
