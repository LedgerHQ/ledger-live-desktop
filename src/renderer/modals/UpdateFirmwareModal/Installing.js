// @flow
import React from "react";
import { useTranslation } from "react-i18next";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ProgressCircle from "~/renderer/components/ProgressCircle";

type Props = {
  progress: number,
  installing: ?string,
};

function Installing({ progress, installing }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Box mx={7} alignItems="center">
        <ProgressCircle size={64} progress={progress} />
      </Box>
      <Box mx={7} mt={4} mb={2}>
        <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade100" fontSize={6}>
          {installing ? t(`manager.modal.steps.${installing}`) : null}
        </Text>
      </Box>
      <Box mx={7} mt={4} mb={7}>
        <Text ff="Inter|Regular" textAlign="center" color="palette.text.shade80" fontSize={4}>
          {t("manager.modal.mcuPin")}
        </Text>
      </Box>
    </>
  );
}

export default Installing;
