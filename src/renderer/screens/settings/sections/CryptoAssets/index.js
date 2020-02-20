// @flow

import React from "react";
import styled from "styled-components";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { SettingsSection as Section } from "../../SettingsSection";
import Currencies from "./Currencies";
import Rates from "./Rates";

const Wrapper: ThemedComponent<{}> = styled.div`
  > ${Section} {
    &:first-of-type {
      margin-bottom: 16px;
    }
  }
`;

const TabCryptoAssets = () => (
  <Wrapper>
    <TrackPage category="Settings" name="Currencies" />
    <Currencies />
    <Rates />
  </Wrapper>
);

export default TabCryptoAssets;
