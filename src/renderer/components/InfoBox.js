// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import InfoCircle from "../icons/InfoCircle";
import type { ThemedComponent } from "../styles/StyleProvider";
import Box from "./Box";
import Text from "./Text";
import { FakeLink } from "./Link";

type Props = {
  children: React$Node,
  onLearnMore?: () => void,
};

export default function InfoBox({ children: description, onLearnMore }: Props) {
  const { t } = useTranslation();
  return (
    <Container>
      <InfoCircle size={12} />
      <Box flex="1" margin={2}>
        <Text ff="Inter|SemiBold" fontSize={3}>
          {description}
        </Text>
      </Box>
      {onLearnMore && (
        <Box>
          <Text ff="Inter|SemiBold" fontSize={3}>
            <FakeLink onClick={onLearnMore}>{t("common.learnMore")}</FakeLink>
          </Text>
        </Box>
      )}
    </Container>
  );
}

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  py: 1,
  px: 2,
  bg: "palette.text.shade10",
}))`
  border-radius: 4px;
  align-items: center;
`;
