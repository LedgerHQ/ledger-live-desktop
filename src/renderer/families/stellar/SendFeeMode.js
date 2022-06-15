// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Tabbable from "~/renderer/components/Box/Tabbable";
import Label from "~/renderer/components/Label";
import LabelInfoTooltip from "~/renderer/components/LabelInfoTooltip";

type Props = {
  isCustomMode: boolean,
  setCustomMode: *,
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

const SendFeeMode = ({ isCustomMode, setCustomMode }: Props) => {
  const setCustom = useCallback(() => setCustomMode(true), [setCustomMode]);
  const setSuggested = useCallback(() => setCustomMode(false), [setCustomMode]);

  return (
    <Box horizontal alignItems="center" justifyContent="space-between">
      <Label>
        <LabelInfoTooltip text={<Trans i18nKey="families.stellar.feeInfoText" />}>
          <span>
            <Trans i18nKey="families.stellar.fee" />
          </span>
        </LabelInfoTooltip>
      </Label>
      <SelectorContainer>
        <Selector active={!isCustomMode} onClick={setSuggested}>
          <Text ff="Inter|SemiBold" fontSize={10}>
            <Trans i18nKey="families.stellar.suggested" />
          </Text>
        </Selector>
        <Selector active={isCustomMode} onClick={setCustom}>
          <Text ff="Inter|SemiBold" fontSize={10}>
            <Trans i18nKey="fees.custom" />
          </Text>
        </Selector>
      </SelectorContainer>
    </Box>
  );
};

export default SendFeeMode;
