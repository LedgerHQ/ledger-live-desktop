// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import LinkWithExternal from "~/renderer/components/LinkWithExternalIcon";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";

const Container: ThemedComponent<*> = styled(Box).attrs(() => ({
  py: 2,
  px: 3,
}))`
  border-radius: 4px;
  border: 1px dashed ${p => p.theme.colors.palette.text.shade50};
`;

const EmptyState = () => {
  const { t } = useTranslation();
  const onSupportLinkClick = useCallback(() => openURL(urls.compound), []);
  return (
    <Container>
      <Text ff="Inter|SemiBold" fontSize={14} color="palette.text.shade100">
        {t("lend.emptyState.active.title")}
      </Text>
      <Box mt={1}>
        <Text ff="Inter|Medium" fontSize={4} color="palette.text.shade50">
          {t("lend.emptyState.active.description")}
        </Text>
      </Box>
      <Box mt={2}>
        <LinkWithExternal onClick={onSupportLinkClick} label={t("lend.emptyState.active.cta")} />
      </Box>
    </Container>
  );
};

export default EmptyState;
