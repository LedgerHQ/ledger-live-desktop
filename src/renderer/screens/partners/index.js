// @flow
import React from "react";
import styled from "styled-components";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import ComingSoon from "~/renderer/icons/ComingSoon";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{ selectable: boolean, pb: number }> = styled(Box)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled(Box)`
  max-width: 205px;
  width: 100%;

  svg {
    width: 100%;
  }
`;

const Partners = () => {
  return (
    <Container pb={6} selectable>
      <TrackPage category="Exchange" />
      <Wrapper>
        <ComingSoon />
      </Wrapper>
    </Container>
  );
};

export default Partners;
