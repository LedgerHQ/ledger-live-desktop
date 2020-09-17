// @flow

import React, { useEffect } from "react";
import Box from "~/renderer/components/Box";
import { Trans, withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { hasAcceptedSwapKYCSelector } from "~/renderer/reducers/settings";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import Card from "~/renderer/components/Box/Card";
import KYC from "~/renderer/screens/swap/KYC";
import BigSpinner from "~/renderer/components/BigSpinner";
import IconExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";

const Body = styled(Box)`
  align-items: center;
  align-self: center;
  text-align: center;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Landing = ({
  providers,
  onContinue,
}: {
  providers?: Array<AvailableProvider>,
  onContinue: any,
}) => {
  const hasAcceptedSwapKYC = useSelector(hasAcceptedSwapKYCSelector);

  useEffect(() => {
    if (providers && providers.length && hasAcceptedSwapKYC) {
      onContinue();
    }
  }, [hasAcceptedSwapKYC, onContinue, providers]);

  const showKYC = providers && !hasAcceptedSwapKYC;

  return showKYC ? (
    <KYC />
  ) : (
    <Card px={80} py={53} alignItems={"center"} justifyContent={"center"} flex={1}>
      <Body>
        <Content>
          {providers === undefined ? (
            <BigSpinner size={50} />
          ) : (
            <Box
              style={{ maxWidth: 256 }}
              mt={32}
              alignItems={"center"}
              color="palette.text.shade50"
            >
              <IconExclamationCircleThin size={40} />
              <Text mt={3} ff="Inter|SemiBold" fontSize={6} color="palette.text.shade100">
                <Trans i18nKey="swap.landing.sorry" />
              </Text>
            </Box>
          )}
        </Content>
      </Body>
    </Card>
  );
};

export default withTranslation()(Landing);
