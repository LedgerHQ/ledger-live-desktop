// @flow
import React from "react";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import { useTranslation } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";

const Wrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  justifyContent: "center",
  alignItems: "center",
}))`
  min-height: 438px;
  row-gap: 5px;
`;

const HistoryPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Text ff="Inter|SemiBold" fontSize={16} color="palette.text.shade100">
        {t("swap2.history.empty.title")}
      </Text>
      <Text ff="Inter|Regular" fontSize={12} color="palette.text.shade50">
        {t("swap2.history.empty.description")}
      </Text>
    </Wrapper>
  );
};

export default HistoryPlaceholder;
