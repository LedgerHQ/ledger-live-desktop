// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import InfoCircle from "../icons/InfoCircle";
import type { ThemedComponent } from "../styles/StyleProvider";
import Box from "./Box";
import Text from "./Text";
import { FakeLink } from "./Link";
import { colors } from "~/renderer/styles/theme";

type Props = {
  children: React$Node,
  onLearnMore?: () => void,
  learnMoreLabel?: React$Node,
  horizontal?: boolean,
  type?: "primary" | "secondary" | "warning" | "security" | "danger" | "success", // TODO implement the styles
};

export default function InfoBox({
  children: description,
  onLearnMore,
  learnMoreLabel,
  horizontal = true,
  type = "primary",
}: Props) {
  const { t } = useTranslation();
  const label = learnMoreLabel || t("common.learnMore");
  return (
    <Container type={type}>
      <InfoCircle size={16} />
      <Box flex="1" ml={16} horizontal={horizontal} alignItems="center">
        <Box flex="1" style={{ wordBreak: "break-all" }}>
          <Text ff="Inter|Regular" fontSize={3} style={{ wordBreak: "break-word" }}>
            {description}
            {onLearnMore && (
              <Text fontSize={3} ml={1} ff="Inter|SemiBold">
                <FakeLink onClick={onLearnMore} color="auto">
                  {label}
                </FakeLink>
              </Text>
            )}
          </Text>
        </Box>
      </Box>
    </Container>
  );
}

const Container: ThemedComponent<{}> = styled(Box).attrs(props => ({
  horizontal: true,
}))`
  padding: 16px;
  border-radius: 4px;
  align-items: center;
  background-color: ${p =>
    p.type === "primary"
      ? p.theme.colors.palette.action.hover
      : p.type === "warning"
      ? colors.lightWarning
      : p.theme.colors.palette.text.shade10};
  color: ${p =>
    p.type === "primary"
      ? p.theme.colors.palette.primary.main
      : p.type === "warning"
      ? colors.orange
      : p.theme.colors.palette.text.shade50};
`;
