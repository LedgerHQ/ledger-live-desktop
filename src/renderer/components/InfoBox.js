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
  horizontal?: boolean,
};

export default function InfoBox({ children: description, onLearnMore, horizontal = true }: Props) {
  const { t } = useTranslation();
  return (
    <Container>
      <InfoCircle size={16} />
      <Box flex="1" margin={2} ml={16} horizontal={horizontal}>
        <Box flex="1">
          <Text ff="Inter|Regular" fontSize={3}>
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
      </Box>
    </Container>
  );
}

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  py: 1,
  px: 2,
  bg: "palette.action.hover",
  color: "palette.primary.main",
}))`
  border-radius: 4px;
  align-items: center;
`;
