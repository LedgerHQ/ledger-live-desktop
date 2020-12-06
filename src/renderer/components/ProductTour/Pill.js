// @flow
import React, { useContext, useMemo } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Wrapper: ThemedComponent<{}> = styled.div`
  background-color: ${p => p.theme.colors.identity};
  color: white;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Pill = () => {
  const { state } = useContext(ProductTourContext);
  const { context } = state;
  const { completedFlows } = context;

  const c = completedFlows?.length || 0;
  const pillKey = useMemo(() => (c < 2 ? "beginner" : c < 4 ? "insider" : "master"), [c]);

  return (
    <Wrapper>
      <Text ff="Inter|SemiBold" fontSize={2}>
        <Trans i18nKey={`productTour.pill.${pillKey}`} />
      </Text>
    </Wrapper>
  );
};

export default Pill;
