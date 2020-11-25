// @flow
import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getTokenCurrencyIcon } from "@ledgerhq/live-common/lib/react";
import type { Account, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { closeModal, openModal } from "~/renderer/actions/modals";

import Modal, { ModalBody } from "~/renderer/components/Modal/index";
import Box from "~/renderer/components/Box/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import { supportedBuyCurrenciesIds } from "~/renderer/screens/exchange/config";

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
  account: Account,
};

const NoEthereumAccountModal = ({ currency, account, ...rest }: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClose = useCallback(() => {
    dispatch(closeModal("MODAL_LEND_EMPTY_ACCOUNT_DEPOSIT"));
  }, [dispatch]);

  const handleReceive = useCallback(() => {
    handleClose();
    dispatch(openModal("MODAL_RECEIVE", { account }));
  }, [dispatch, handleClose, account]);

  const handleBuy = useCallback(() => {
    handleClose();
    history.push({
      pathname: "/exchange",
      state: {
        tab: 0,
        defaultCurrency: currency,
        source: "lending deposit",
      },
    });
  }, [history, handleClose, currency]);

  const TokenCurrencyIcon = getTokenCurrencyIcon(currency);
  const buyAvailable = supportedBuyCurrenciesIds.includes(currency.id);

  return (
    <Modal
      {...rest}
      name="MODAL_LEND_EMPTY_ACCOUNT_DEPOSIT"
      centered
      onBack={undefined}
      onClose={handleClose}
      preventBackdropClick={false}
      render={({ onClose, data }) => (
        <ModalBody
          title={<Trans i18nKey="lend.lendAsset" />}
          noScroll
          onClose={handleClose}
          render={() => (
            <Box flow={4}>
              <Box alignItems="center">
                <AmountUpWrapper>
                  {TokenCurrencyIcon ? <TokenCurrencyIcon size={24} /> : null}
                </AmountUpWrapper>
                <Text ff="Inter|Bold" my={3} fontSize={4} textAlign="center">
                  <Trans
                    i18nKey="lend.emptyAccountDeposit.title"
                    values={{ asset: currency.name }}
                  />
                </Text>
                <Text ff="Inter|Regular" fontSize={4} textAlign="center">
                  <Trans
                    i18nKey="lend.emptyAccountDeposit.description"
                    values={{ asset: currency.name }}
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
              <Button primary={!buyAvailable} outlineGrey={buyAvailable} onClick={handleReceive}>
                <Trans
                  i18nKey="lend.emptyAccountDeposit.ctaReceive"
                  values={{ asset: currency.name }}
                />
              </Button>
              {buyAvailable ? (
                <Button ml={2} primary onClick={handleBuy}>
                  <Trans
                    i18nKey="lend.emptyAccountDeposit.ctaBuy"
                    values={{ asset: currency.name }}
                  />
                </Button>
              ) : null}
            </Box>
          )}
        />
      )}
    />
  );
};

export default memo<Props>(NoEthereumAccountModal);
