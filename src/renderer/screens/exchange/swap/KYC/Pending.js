// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import IconCheck from "~/renderer/icons/Check";
import IconClock from "~/renderer/icons/Clock";
import IconCross from "~/renderer/icons/Cross";

export const CircleWrapper: ThemedComponent<{}> = styled.div`
  border-radius: 50%;
  border: 1px solid transparent;
  background: ${p => rgba(p.failed ? p.theme.colors.alertRed : p.theme.colors.positiveGreen, 0.1)};
  color: ${p => (p.failed ? p.theme.colors.alertRed : p.theme.colors.positiveGreen)};
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

const Pending = ({
  onContinue,
  status = "pending",
}: {
  onContinue: () => void,
  status?: string,
}) => {
  const rejected = status === "closed";
  const dispatch = useDispatch();

  const onResetKYC = useCallback(() => {
    dispatch(setSwapKYCStatus({ provider: "wyre" }));
    onContinue();
  }, [dispatch, onContinue]);

  return (
    <Box px={40} style={{ minHeight: 560 }} justifyContent={"center"} alignItems={"center"}>
      {rejected ? (
        <CircleWrapper failed size={50}>
          <IconCross size={25} />
        </CircleWrapper>
      ) : (
        <CircleWrapper size={50}>
          <IconCheck size={25} />
          <WrapperClock>
            <IconClock size={16} />
          </WrapperClock>
        </CircleWrapper>
      )}
      <Text mt={16} ff="Inter|SemiBold" fontSize={16} color="palette.text.shade90">
        <Trans i18nKey={`swap.kyc.wyre.${status}.title`} />
      </Text>
      <Text mt={16} ff="Inter|Regular" fontSize={13} color="palette.text.shade50">
        <Trans i18nKey={`swap.kyc.wyre.${status}.subtitle`} />
      </Text>
      <Text mt={24} ff="Inter|SemiBold" fontSize={13} color="palette.text.shade100">
        <LinkWithExternalIcon onClick={() => {}} color="palette.primary.main">
          <Text ff="Inter|SemiBold" fontSize={13}>
            <Trans i18nKey={`swap.kyc.wyre.${status}.link`} />
          </Text>
        </LinkWithExternalIcon>
      </Text>
      <Button primary mt={20} onClick={rejected ? onResetKYC : onContinue}>
        <Trans i18nKey={`swap.kyc.wyre.${status}.cta`} />
      </Button>
    </Box>
  );
};

export default Pending;
