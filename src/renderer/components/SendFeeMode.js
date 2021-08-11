// @flow

import React, { useCallback } from "react";
import { Trans, withTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Switch from "~/renderer/components/Switch";
import Label from "~/renderer/components/Label";

type Props = {
  isAdvanceMode: boolean,
  setAdvanceMode: *,
};

const StandardText = styled(Text)`
  color: ${p =>
    p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade50};
  &:hover {
    cursor: pointer;
  }
`;

const AdvancedText = styled(Text)`
  color: ${p =>
    p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade50};
  &:hover {
    cursor: pointer;
  }
`;

const Divider = styled(Box)`
  color: ${p => p.theme.colors.palette.text.shade70};
  width: 26px;
  font-size: 12px;
  line-height: 17px;
`;

const ModeBox = styled(Box)`
  width: 135px;
`;

const SendFeeMode = ({ isAdvanceMode, setAdvanceMode }: Props) => {
  const toggleAdvanceMode = useCallback(() => {
    setAdvanceMode(!isAdvanceMode);
  }, [setAdvanceMode, isAdvanceMode]);

  return (
    <Box horizontal alignItems="center" justifyContent="flex-start" style={{ width: 200 }}>
      <Label>
        <span>
          <Trans i18nKey="send.steps.amount.fees" />
        </span>
      </Label>
      <Divider alignItems="center">|</Divider>
      <ModeBox horizontal alignItems="center" justifyContent="space-between">
        <StandardText
          ff="Inter"
          fontSize={10}
          fontWeight="600"
          selected={!isAdvanceMode}
          onClick={toggleAdvanceMode}
        >
          <Trans i18nKey="send.steps.amount.standard" />
        </StandardText>
        <Switch
          forceBgColor={isAdvanceMode ? "wallet" : undefined}
          small
          isChecked={isAdvanceMode}
          onChange={toggleAdvanceMode}
        />
        <AdvancedText
          ff="Inter"
          fontSize={10}
          fontWeight="600"
          selected={isAdvanceMode}
          onClick={toggleAdvanceMode}
        >
          <Trans i18nKey="send.steps.amount.advanced" />
        </AdvancedText>
      </ModeBox>
    </Box>
  );
};

export default withTranslation()(SendFeeMode);
