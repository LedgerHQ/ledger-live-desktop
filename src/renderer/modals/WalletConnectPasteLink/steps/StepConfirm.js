// @flow
import React, { useContext } from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Button from "~/renderer/components/Button";
import { context, STATUS, approveSession } from "~/renderer/screens/WalletConnect/Provider";
import BigSpinner from "~/renderer/components/BigSpinner";
import Text from "~/renderer/components/Text";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import WCLogo from "~/renderer/images/walletconnect.png";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";

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

const AccountContainer: ThemedComponent<*> = styled(Box)`
  width: 100%;
  border: solid 1px ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
`;

export default function StepConfirm({ account, link, setLink }: StepProps) {
  const wcContext = useContext(context);
  const { t } = useTranslation();

  return (
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
          <Text
            mt={20}
            textAlign="center"
            ff="Inter|Regular"
            fontSize={4}
            color="palette.text.shade50"
          >
            <Trans i18nKey="walletconnect.steps.confirm.details" />
          </Text>
          <AccountContainer alignItems={"center"} p={20} mt={20}>
            <Box justifyContent="center" horizontal mb="10px">
              {account?.currency ? <ParentCryptoCurrencyIcon currency={account.currency} /> : null}
              <Text
                ml={"5px"}
                textAlign="center"
                ff="Inter|Bold"
                fontSize={4}
                color="palette.text.shade100"
              >
                {account?.name}
              </Text>
            </Box>
            <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade50">
              {account?.freshAddress}
            </Text>
          </AccountContainer>
        </Box>
      ) : (
        <Box alignItems={"center"} justifyContent={"center"} p={20}>
          <BigSpinner size={40} />
        </Box>
      )}
    </Box>
  );
}

export function StepConfirmFooter({ link, onClose, account, onCloseWithoutDisconnect }: StepProps) {
  const wcContext = useContext(context);
  const history = useHistory();

  return (
    <Box horizontal justifyContent="flex-end">
      {wcContext.status === STATUS.CONNECTING && wcContext.dappInfo ? (
        <Button
          onClick={() => {
            onClose();
          }}
          outline
        >
          <Trans i18nKey="common.reject" />
        </Button>
      ) : null}
      <Box style={{ width: 10 }} />
      <Button
        onClick={() => {
          approveSession(account);
          onCloseWithoutDisconnect();
          history.push({
            pathname: "/walletconnect",
          });
        }}
        primary
        disabled={!(wcContext.status === STATUS.CONNECTING && wcContext.dappInfo)}
        id="wc-paste-link-confirm-continue"
      >
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
