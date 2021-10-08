// @flow

import React from "react";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import SwapCircle from "~/renderer/icons/SwapCircle";

import { SWAP_VERSION } from "../../utils/index";
import TrackPage from "~/renderer/analytics/TrackPage";

const Body = styled(Box).attrs({
  alignItems: "center",
  color: "palette.text.shade50",
})`
  max-width: 25.5rem;
  position: absolute;
  row-gap: 1.5rem;
`;

const TextSection = styled(Box)`
  row-gap: 0.8125rem;
`;

const IconContainer = styled.div`
  color: ${p => p.theme.colors.palette.primary.main};
`;

const FormNotAvailable = () => {
  const { t } = useTranslation();

  return (
    <Box justifyContent="center" alignItems="center">
      <TrackPage category="Swap" name="NotAvailable" swapVersion={SWAP_VERSION} />
      <Body>
        <IconContainer>
          <SwapCircle size={70} />
        </IconContainer>
        <TextSection>
          <Text textAlign="center" ff="Inter|SemiBold" fontSize={5} color="palette.text.shade100">
            {t("swap2.form.notAvailable.title")}
          </Text>
          <Text
            textAlign="center"
            ff="Inter|Regular"
            fontSize="0.875rem"
            color="palette.text.shade50"
          >
            <Trans i18nKey="swap2.form.notAvailable.content" components={{ br: <br /> }} />
          </Text>
        </TextSection>
      </Body>
    </Box>
  );
};

export default FormNotAvailable;
