// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import WorldMap from "~/renderer/icons/WorldMap";
import { Trans, withTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import Card from "~/renderer/components/Box/Card";
import IconExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";

const Body = styled(Box)`
  align-items: center;
  align-self: center;
  text-align: center;
  position: relative;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;

  > ${Box} {
    position: absolute;
  }
`;

const NotAvailable = () => (
  <Card px={80} py={53} alignItems={"center"} justifyContent={"center"} flex={1}>
    <TrackPage category="Swap" name="NotAvailable" />
    <Body>
      <Content>
        <>
          <WorldMap />
          <Box style={{ maxWidth: 256 }} mt={32} alignItems={"center"} color="palette.text.shade50">
            <IconExclamationCircleThin size={40} />
            <Text mt={3} ff="Inter|SemiBold" fontSize={6} color="palette.text.shade100">
              <Trans i18nKey="swap.landing.sorry" />
            </Text>
          </Box>
        </>
      </Content>
    </Body>
  </Card>
);

export default withTranslation()(NotAvailable);
