// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import SwapForm from "./Form";
import styled from "styled-components";

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 27.5rem 1fr;
  row-gap: 1.5rem;

  padding: 2rem 0;
  background-color: ${p => p.theme.colors.palette.background.paper};

  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  box-shadow: 0px 4px 6px rgba(20, 37, 51, 0.04);

  & > * {
    // Automatically move every children in the middle column
    grid-column-start: 2;
    grid-column-end: 3;
  }
`;

const Header = styled.div`
  padding: 0 2rem;
`;

const Subtitle = styled(Text).attrs({
  textAlign: "center",
  ff: "Inter",
  fontSize: "0.8125rem",
  lineHeight: "1.4",
})`
  display: inline-block;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const Swap2 = () => {
  const { t } = useTranslation();

  return (
    <>
      <TrackPage category="Swap" />
      <Text horizontal mb={20} ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100">
        {t("swap.title")}
      </Text>
      <Main>
        <Header>
          <Subtitle>{t("swap2.subtitle")}</Subtitle>
        </Header>
        <SwapForm />
      </Main>
    </>
  );
};

export default Swap2;
