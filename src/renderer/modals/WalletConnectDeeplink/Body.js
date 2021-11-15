// @flow
import React, { useContext, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import type { BodyProps } from "./types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Footer from "./Footer";
import {
  context,
  STATUS,
  connect,
  disconnect,
  approveSession,
} from "~/renderer/screens/WalletConnect/Provider";
import BigSpinner from "~/renderer/components/BigSpinner";
import SelectAccount from "~/renderer/components/SelectAccount";
import Text from "~/renderer/components/Text";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import WCLogo from "~/renderer/images/walletconnect.png";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";

const LogoContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 64px;
  border: solid 1px ${p => p.theme.colors.palette.divider};
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
`;

const DottedLine = styled.hr`
  border: none;
  border-top: 3px dotted ${p => p.theme.colors.palette.divider};
  height: 3px;
  width: 54px;
  margin-left: 16px;
  margin-right: 16px;
`;

const Body = ({ onClose, link }: BodyProps) => {
  const wcContext = useContext(context);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [account, setAccount] = useState<?Account>();

  const handleReject = useCallback(() => {
    disconnect();
    onClose();
  }, [onClose]);
  
  const filterAccountSelect = useCallback(a => getAccountCurrency(a).id === "ethereum", []);
  const ethAccounts = useSelector(accountsSelector).filter(filterAccountSelect);

  useEffect(() => {
    connect(link);
  }, [link]);

  const handleAddAccount = useCallback(() => {
    handleReject();
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return (
    <ModalBody
      title={t("walletconnect.titleAccount")}
      onClose={handleReject}
      render={() => (
        <Box flow={1}>
          {wcContext.status === STATUS.ERROR ? (
            <Box>{wcContext.error?.message || t("walletconnect.invalidAccount")}</Box>
          ) : wcContext.status === STATUS.CONNECTING && wcContext.dappInfo ? (
            <Box alignItems={"center"} p={20}>
              <Box horizontal alignItems={"center"} mb={32}>
                <LogoContainer>
                  <Logo src={WCLogo} />
                </LogoContainer>
                <DottedLine />
                <LogoContainer>
                  <Logo src={LedgerLiveImg} />
                </LogoContainer>
              </Box>
              <Text ff="Inter|Bold" fontSize={4} color="palette.text.shade100">
                {wcContext.dappInfo.name}
              </Text>
              {ethAccounts.length > 0 ? (
                <>
                  <Text
                    mt={20}
                    textAlign="center"
                    ff="Inter|Regular"
                    fontSize={4}
                    color="palette.text.shade50"
                  >
                    {t("walletconnect.steps.confirm.deeplinkDetails")}
                  </Text>
                  <Box mt={20} width="100%">
                    <SelectAccount
                      autoFocus
                      filter={filterAccountSelect}
                      onChange={setAccount}
                      value={account}
                    />
                  </Box>
                </>
              ) : (
              <>
                <Text
                    mt={20}
                    textAlign="center"
                    ff="Inter|Regular"
                    fontSize={4}
                    color="palette.text.shade50"
                  >
                    {t("walletconnect.steps.confirm.noEthAccount")}
                  </Text>
                  <Box mt={20}>
                    <Button primary onClick={handleAddAccount}>
                      {t("addAccounts.cta.addAccountName", {
                        currencyName: "Ethereum",
                      })}
                    </Button>
                  </Box>
              </>
              )
            }
            </Box>
          ) : (
            <Box alignItems={"center"} justifyContent={"center"} p={20}>
              <BigSpinner size={40} />
            </Box>
          )}
        </Box>
      )}
      renderFooter={() => (
        <Footer
          wcDappName={wcContext.dappInfo?.name}
          wcStatus={wcContext.status}
          account={account}
          onReject={handleReject}
          onContinue={() => {
            approveSession(account);
            onClose();
            history.push({
              pathname: "/walletconnect",
            });
          }}
        />
      )}
    />
  );
};

export default Body;
