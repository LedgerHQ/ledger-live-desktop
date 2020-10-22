// @flow

import React from "react";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import { shell } from "electron";

const TokenTipsContainer: ThemedComponent<{}> = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  font-weight: 400;
  padding: 16px;
`;

const Strong: ThemedComponent<{}> = styled.span`
  font-weight: 700;
`;
const LearnMore: ThemedComponent<{}> = styled.a`
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
`;

const TokenTips = function TokenTips({
  textKey,
  textData,
  learnMoreLink,
}: {
  textKey: string,
  textData: any,
  learnMoreLink?: string,
}) {
  return (
    <TokenTipsContainer mt={4} horizontal alignItems="center">
      <InfoCircle size={16} color={colors.wallet} />
      <Text style={{ flex: 1, marginLeft: 20 }} ff="Inter|Regular" fontSize={4}>
        <Trans i18nKey={textKey} values={textData} components={{ bold: <Strong /> }} />
        {learnMoreLink && (
          <>
            <span>&nbsp;</span>
            <LearnMore
              href={learnMoreLink}
              onClick={() => {
                shell.openExternal(learnMoreLink);
              }}
            >
              <Trans i18nKey="common.learnMore" />
            </LearnMore>
          </>
        )}
      </Text>
    </TokenTipsContainer>
  );
};

export default TokenTips;
