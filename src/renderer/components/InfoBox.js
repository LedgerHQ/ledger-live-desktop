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
  warn?: boolean,
};

export default function InfoBox({
  children: description,
  onLearnMore,
  learnMoreLabel,
  horizontal = true,
  warn = false,
}: Props) {
  const { t } = useTranslation();
  const label = learnMoreLabel || t("common.learnMore");
  return (
    <Container warn>
      <InfoCircle size={16} />
      <Box flex="1" margin={2} ml={16} horizontal={horizontal} alignItems="center">
        <Box flex="1" style={{ wordBreak: "break-all" }}>
          <Text ff="Inter|Regular" fontSize={3} style={{ wordBreak: "break-word" }}>
            {description}
          </Text>
        </Box>
        {onLearnMore && (
          <Box>
            <Text ff="Inter|SemiBold" fontSize={3}>
              <FakeLink onClick={onLearnMore}>{label}</FakeLink>
            </Text>
          </Box>
        )}
      </Box>
    </Container>
  );
}

const Container: ThemedComponent<{}> = styled(Box).attrs(props => ({
  horizontal: true,
  py: 1,
  px: 2,
  bg: props.warn ? colors.lightWarning : "palette.action.hover",
  color: props.warn ? colors.orange : "palette.primary.main",
}))`
  border-radius: 4px;
  align-items: center;
`;
