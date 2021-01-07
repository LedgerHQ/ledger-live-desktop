// @flow

import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import swapIllustration from "~/renderer/images/swap.png";
import CheckBox from "~/renderer/components/CheckBox";
import Button from "~/renderer/components/Button";
import { setHasAcceptedSwapKYC } from "~/renderer/actions/settings";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

const Title = styled(Text)`
  align-items: center;
  align-self: center;
  text-align: center;

  font-size: 18px;
  line-height: 22px;
  color: ${p => p.theme.colors.palette.text.shade100};
  margin-bottom: 10px;
`;

const Subtitle = styled(Text)`
  align-items: center;
  align-self: center;
  text-align: center;

  font-size: 13px;
  line-height: 19px;
  padding: 0 100px;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const Disclaimer = styled(Text)`
  flex: 1;
  margin-left: 14px;
  margin-right: 40px;
  font-size: 12px;
  line-height: 18px;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const Illustration = styled.div`
  margin-bottom: 24px;
  width: 248px;
  height: 132px;
  background: url(${swapIllustration});
  background-size: contain;
  align-self: center;
`;

const Footer = styled.div`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  flex-direction: row;
  align-items: center;
  display: flex;
  padding: 24px;
`;

const KYC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const onAcceptSwapKYC = useCallback(() => dispatch(setHasAcceptedSwapKYC(true)), [dispatch]);

  return (
    <Card flex={1} pt={53} justifyContent={"space-between"}>
      <TrackPage category="Swap" name="KYC Landing" />
      <Box flex={1} justifyContent={"center"}>
        <Illustration />
        <Title ff="Inter|SemiBold">
          <Trans i18nKey={"swap.kyc.title"} />
        </Title>
        <Subtitle ff="Inter|Medium">
          <Trans i18nKey={"swap.kyc.subtitle"} />
        </Subtitle>
        <Box alignSelf={"center"} mb={44} mt={2}>
          <LinkWithExternalIcon
            ff="Inter|Regular"
            fontSize={3}
            onClick={() => openURL(urls.swap.info)}
          >
            <Trans i18nKey="swap.whatIsSwap" />
          </LinkWithExternalIcon>
        </Box>
      </Box>
      <Footer>
        <CheckBox id={"swap-landing-kyc-tos"} isChecked={isChecked} onChange={setIsChecked} />
        <Disclaimer ff="Inter|Regular" onClick={() => setIsChecked(!isChecked)}>
          <Trans i18nKey={"swap.kyc.disclaimer"} />
        </Disclaimer>
        <Button
          id={"swap-landing-kyc-continue-button"}
          disabled={!isChecked}
          primary
          onClick={onAcceptSwapKYC}
          event={"SwapAcceptKYC"}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Footer>
    </Card>
  );
};

export default KYC;
