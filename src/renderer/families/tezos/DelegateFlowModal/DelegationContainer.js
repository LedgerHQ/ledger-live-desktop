// @flow
import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import DelegationIcon from "~/renderer/icons/Delegation";
import UndelegationIcon from "~/renderer/icons/Undelegation";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  left: React$Node,
  right: React$Node,
  undelegation?: boolean,
};

const Wrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  justify-content: space-between;
  align-items: flex-start;
`;

const Container = styled(Box)`
  align-self: center;
`;

const DelegationContainer = ({ left, right, undelegation }: Props) => (
  <Wrapper>
    {left}
    <Container>
      {undelegation ? <UndelegationIcon size={76} /> : <DelegationIcon size={76} />}
    </Container>
    {right}
  </Wrapper>
);

export default DelegationContainer;
