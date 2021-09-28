// @flow

import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Tabbable from "~/renderer/components/Box/Tabbable";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { track } from "~/renderer/analytics/segment";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";

type Props = {
  isAdvanceMode: boolean,
  setAdvanceMode: *,
};

const SelectorContainer = styled.div`
  display: inline-flex;
  cursor: pointer;
  overflow: hidden;
  border-radius: 9999px;
`;
const Selector = styled(Tabbable)`
  color: ${p =>
    p.active ? p.theme.colors.palette.primary.contrastText : p.theme.colors.palette.text.shade20};
  background: ${p =>
    p.active ? p.theme.colors.palette.primary.main : p.theme.colors.palette.action.disabled};
  padding: 4px 12px 4px 12px;
`;

const SendFeeMode = ({ isAdvanceMode, setAdvanceMode }: Props) => {
  const { t } = useTranslation();
  const setAdvanced = useCallback(() => setAdvanceMode(true), [setAdvanceMode]);
  const setStandard = useCallback(() => setAdvanceMode(false), [setAdvanceMode]);

  return (
    <Box horizontal alignItems="center" justifyContent="space-between">
      <LabelWithExternalIcon
        onClick={() => {
          openURL(urls.feesMoreInfo);
          track("Send Flow Fees Help Requested");
        }}
        label={t("send.steps.amount.fees")}
      />
      <SelectorContainer>
        <Selector active={!isAdvanceMode} onClick={setStandard}>
          <Text ff="Inter|SemiBold" fontSize={10}>
            <Trans i18nKey="send.steps.amount.standard" />
          </Text>
        </Selector>
        <Selector active={isAdvanceMode} onClick={setAdvanced}>
          <Text ff="Inter|SemiBold" fontSize={10}>
            <Trans i18nKey="send.steps.amount.advanced" />
          </Text>
        </Selector>
      </SelectorContainer>
    </Box>
  );
};

export default SendFeeMode;
