// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import Card from "~/renderer/components/Box/Card";
import BigSpinner from "~/renderer/components/BigSpinner";

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
`;

const Loading = () => (
  <Card px={80} py={53} alignItems={"center"} justifyContent={"center"} flex={1}>
    <TrackPage category="Swap" name="LoadingProviders" />
    <Body>
      <Content>
        <BigSpinner size={50} />
      </Content>
    </Body>
  </Card>
);

export default withTranslation()(Loading);
