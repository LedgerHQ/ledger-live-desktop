// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { colors } from "~/renderer/styles/theme";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const TokenTipsContainer: ThemedComponent<{}> = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  font-weight: 400;
  padding: 16px;
`;

const TokenTips = function TokenTips({ textKey, textData }: { textKey: string, textData: any }) {
  const { t } = useTranslation();
  return (
    <TokenTipsContainer mt={4} horizontal alignItems="center">
      <InfoCircle size={16} color={colors.wallet} />
      <Text style={{ flex: 1, marginLeft: 20 }} ff="Inter|Regular" fontSize={4}>
        {t(textKey, textData)}
      </Text>
    </TokenTipsContainer>
  );
};

export default TokenTips;
