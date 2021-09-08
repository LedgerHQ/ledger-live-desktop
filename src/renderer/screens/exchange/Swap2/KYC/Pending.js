// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconCheck from "~/renderer/icons/Check";
import IconClock from "~/renderer/icons/Clock";
import Button from "~/renderer/components/Button";
import InfoCircle from "~/renderer/icons/InfoCircle";
import { useRedirectToSwapForm } from "../utils/index";

export const CircleWrapper: ThemedComponent<{}> = styled.div`
  border-radius: 50%;
  border: 1px solid transparent;
  background: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
`;

const WrapperClock: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  color: "palette.text.shade60",
}))`
  border-radius: 50%;
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 3px;
`;

const Container: ThemedComponent<{}> = styled(Box).attrs({
  p: 20,
  justifyContent: "center",
  alignItems: "center",
})`
  height: 100%;
  max-width: 27.5rem;
  align-self: center;
  text-align: center;
  position: relative;
`;

const InfoTag = styled.div`
  position: absolute;
  top: 32px;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  background: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  column-gap: 4px;
`;

const Pending = () => {
  const redirectToSwapForm = useRedirectToSwapForm();
  const onLearnMore = useCallback(() => {
    openURL(urls.swap.providers.wyre.kyc);
  }, []);

  return (
    <Container>
      <InfoTag>
        <Text ff="Inter|SemiBold" fontSize={2}>
          <Trans i18nKey="swap2.kyc.wyre.pending.info" />
        </Text>
        <InfoCircle size={13} />
      </InfoTag>
      <TrackPage category="Swap" name="KYC Pending" />
      <CircleWrapper size={50}>
        <IconCheck size={25} />
        <WrapperClock>
          <IconClock size={16} />
        </WrapperClock>
      </CircleWrapper>
      <Text mt={24} ff="Inter|SemiBold" fontSize={16} color="palette.text.shade90">
        <Trans i18nKey={`swap2.kyc.wyre.pending.title`} />
      </Text>
      <Text mt={16} ff="Inter|Regular" fontSize={13} color="palette.text.shade50">
        <Trans i18nKey={`swap2.kyc.wyre.pending.subtitle`} />
      </Text>
      <Box mt={28} horizontal>
        <LinkWithExternalIcon onClick={onLearnMore} color="palette.primary.main">
          <Text ff="Inter|SemiBold" fontSize={13}>
            <Trans i18nKey={`swap2.kyc.wyre.pending.link`} />
          </Text>
        </LinkWithExternalIcon>
      </Box>
      <Button mt={28} primary onClick={redirectToSwapForm}>
        Continue
      </Button>
    </Container>
  );
};

export default Pending;
