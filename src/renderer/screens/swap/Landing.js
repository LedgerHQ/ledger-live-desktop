// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import { Trans, withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { hasAcceptedSwapKYCSelector } from "~/renderer/reducers/settings";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import WorldMap from "~/renderer/icons/WorldMap";
import Card from "~/renderer/components/Box/Card";
import KYC from "~/renderer/screens/swap/KYC";
import Spinner from "~/renderer/components/Spinner";
import IconExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";

const Body = styled(Box)`
  align-items: center;
  align-self: center;
  text-align: center;
  position: relative;
`;

const Illustration = styled.div`
  margin-bottom: 24px;
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
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
  if (providers && providers.length && hasAcceptedSwapKYC) {
    onContinue();
  }
  const showKYC = providers && !hasAcceptedSwapKYC;

  return showKYC ? (
    <KYC />
  ) : (
    <Card
      px={80}
      py={53}
      alignItems={"center"}
      justifyContent={"center"}
      style={{ minHeight: 438 }}
    >
      <Body>
        <Illustration>
          <WorldMap />
        </Illustration>
        <Content>
          {providers && !providers.length ? (
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
          ) : (
            <Spinner size={40} />
          )}
        </Content>
      </Body>
    </Card>
  );
};

export default withTranslation()(Landing);
