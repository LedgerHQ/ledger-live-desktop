// @flow
import React, { useContext } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { context, STATUS, approveSession } from "~/renderer/screens/WalletConnect/Provider";
import BigSpinner from "~/renderer/components/BigSpinner";
import Text from "~/renderer/components/Text";
import Image from "~/renderer/components/Image";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import WCLogo from "~/renderer/images/walletconnect.png";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";

const LogoContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 64px;
  border: solid 1px rgba(20, 37, 51, 0.1);
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
`;

const DottedLine = styled.hr`
  border: none;
  border-top: 3px dotted rgba(20, 37, 51, 0.2);
  height: 3px;
  width: 54px;
  margin-left: 16px;
  margin-right: 16px;
`;

export default function StepConfirm({ account, link, setLink }: StepProps) {
  const wcContext = useContext(context);

  console.log(wcContext);

  return (
    <Box flow={1}>
      {wcContext.status === STATUS.ERROR ? (
        <Box>Error</Box>
      ) : wcContext.status === STATUS.CONNECTING && wcContext.dappInfo ? (
        <Box alignItems={"center"} p={20}>
          <Box horizontal alignItems={"center"} mb={32}>
            <LogoContainer>
              <Logo src={WCLogo} />
            </LogoContainer>
            <DottedLine />
            <LogoContainer>
              <LedgerLiveLogo
                width="100%"
                height="100%"
                icon={<Image resource={LedgerLiveImg} alt="" width={"100%"} height={"100%"} />}
              />
            </LogoContainer>
          </Box>
          <Text ff="Inter|Bold" fontSize={4} color="palette.text.shade100">
            {wcContext.dappInfo.name}
          </Text>
          <Box style={{ height: 20 }} />
          <Text textAlign="center" ff="Inter|Regular" fontSize={4} color="palette.text.shade50">
            <Trans i18nKey="walletconnect.steps.confirm.details" />
          </Text>
          <Box style={{ height: 20 }} />
          <Box
            style={{
              width: "100%",
              border: "solid 1px rgba(0,0,0, 0.2)",
              borderRadius: 4,
            }}
            alignItems={"center"}
            p={20}
          >
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
          </Box>
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
          Reject
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
        Continue
      </Button>
    </Box>
  );
}
