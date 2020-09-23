// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Card from "~/renderer/components/Box/Card";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Compound from "~/renderer/images/compound.svg";

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Box p={24} alignItems="center">
        <CompoundImg />
        <Box mt={24}>
          <Text ff="Inter|SemiBold" fontSize={14} color="palette.text.shade100">
            {t("lend.emptyState.closed.title")}
          </Text>
        </Box>
        <Box mt={2}>
          <Text ff="Inter|Medium" fontSize={4} color="palette.text.shade50">
            {t("lend.emptyState.closed.description")}
          </Text>
        </Box>
        <Box mt={3}>
          <Button primary onClick={() => {}}>
            {t("lend.emptyState.closed.cta")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

const CompoundImg = styled.img.attrs(() => ({ src: Compound }))`
  width: 72px;
  height: auto;
`;

export default EmptyState;
