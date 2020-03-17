// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import IconSwap from "~/renderer/icons/Swap";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import Button from "~/renderer/components/Button";

const IconWrapper = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

const Pill = styled(Text)`
  border-radius: 4px;
  background: ${p => p.theme.colors.palette.text.shade10};
  padding: 0 8px;
`;
const StepFinished = ({ swapId }: { swapId: string }) => (
  <Box alignItems="center">
    <IconWrapper>
      <IconSwap size={18} />
    </IconWrapper>
    <Text mt={16} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
      <Trans i18nKey={`swap.modal.steps.finished.title`} />
    </Text>
    <Box mt={16} horizontal alignItems="center">
      <Text color="palette.text.shade50" ff="Inter|Regular" fontSize={14}>
        <Trans i18nKey={`swap.modal.steps.finished.swap`} />
      </Text>
      <Pill ml={2} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={14}>
        {swapId}
      </Pill>
    </Box>
    <Text p={20} textAlign="center" color="palette.text.shade50" ff="Inter|Regular" fontSize={4}>
      <Trans i18nKey={`swap.modal.steps.finished.description`} />
    </Text>
  </Box>
);

export const StepFinishedFooter = ({ onClose }: { onClose: any }) => (
  <Button onClick={onClose} secondary>
    <Trans i18nKey="common.close" />
  </Button>
);

export default StepFinished;
