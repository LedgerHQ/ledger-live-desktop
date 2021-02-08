// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import InfoCircle from "../icons/InfoCircle";
import IconShield from "../icons/Shield";
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
  type?: "primary" | "secondary" | "warning" | "security" | "danger" | "success" | "grey", // TODO implement the styles
};

const getTypeColor = (p) => {
  switch (p.type) {
    case "primary":
      return {
        backgroundColor: p.theme.colors.palette.action.hover,
        textColor: p.theme.colors.palette.primary.main,
      };
    case "warning":
      return {
        backgroundColor: colors.lightWarning,
        textColor: colors.orange,
      };
    case "grey":
      return {
        backgroundColor: p.theme.colors.palette.action.hover,
        textColor: colors.grey,
      };
    case "security":
      return {
        backgroundColor: "rgba(234, 46, 73, 0.1)",
        textColor: colors.alertRed,
      };
    default:
      return {
        backgroundColor: p.theme.colors.palette.text.shade10,
        textColor: p.theme.colors.palette.text.shade50,
      };
  }
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
      {type === "security" ? (
        <IconShield color={colors.alertRed} height={32} width={28} />
      ) : (
        <InfoCircle size={16} />
      )}
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

const Container: ThemedComponent<{}> = styled(Box).attrs((props) => ({
  horizontal: true,
}))`
  padding: 16px;
  border-radius: 4px;
  align-items: center;
  background-color: ${(p) => getTypeColor(p).backgroundColor};
  color: ${(p) => getTypeColor(p).textColor};
`;
