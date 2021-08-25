// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import WorldMap from "~/renderer/icons/WorldMap";
import IconExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";

import Track from "~/renderer/analytics/Track";

const Body = styled(Box).attrs({
  alignItems: "center",
  color: "palette.text.shade50",
})`
  max-width: 16rem;
  position: absolute;
`;

const FormNotAvailable = () => {
  const { t } = useTranslation();

  return (
    <Box justifyContent="center" alignItems="center">
      <Track onMount event="NotAvailable" />
      <WorldMap />
      <Body>
        <IconExclamationCircleThin size={40} />
        <Text
          textAlign="center"
          mt={3}
          ff="Inter|SemiBold"
          fontSize={6}
          color="palette.text.shade100"
        >
          {t("swap2.form.notAvailable")}
        </Text>
      </Body>
    </Box>
  );
};

export default FormNotAvailable;
