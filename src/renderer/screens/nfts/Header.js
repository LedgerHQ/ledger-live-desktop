// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";

const AccountsHeader = () => {
  const { t } = useTranslation();

  return (
    <Box horizontal style={{ paddingBottom: 32 }}>
      <Box grow ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="accounts-title">
        {t("nfts.title")}
      </Box>
      <Box horizontal flow={2} alignItems="center" justifyContent="flex-end"></Box>
    </Box>
  );
};

export default React.memo<{}>(AccountsHeader);
