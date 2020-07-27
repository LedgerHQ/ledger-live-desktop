// @flow
import React, { useCallback } from "react";
import type { Operation } from "@ledgerhq/live-common/lib/types/operation";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/swap/types";
import Box from "~/renderer/components/Box";
import IconSwap from "~/renderer/icons/Swap";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import Button from "~/renderer/components/Button";
import { openModal } from "~/renderer/actions/modals";
import InfoCircle from "~/renderer/icons/InfoCircle";
import useTheme from "~/renderer/hooks/useTheme";
import { useDispatch } from "react-redux";

const IconWrapper = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

const Disclaimer = styled(Box)`
  background: ${colors.pillActiveBackground};
  border-radius: 4px;
  align-items: center;
  width: 100%;
`;

const Pill = styled(Text)`
  user-select: text;
  border-radius: 4px;
  background: ${p => p.theme.colors.palette.text.shade10};
  padding: 0 8px;
`;
const StepFinished = ({ swapId, provider }: { swapId: string, provider: string }) => (
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
      <Trans i18nKey={`swap.modal.steps.finished.description`} values={{ provider }} />
    </Text>
    <Disclaimer horizontal p={2} mt={3}>
      <InfoCircle size={17} color={useTheme("colors.palette.primary.main")} />
      <Text
        textAlign={"left"}
        flex={1}
        ml={2}
        color="palette.primary.main"
        ff="Inter|Regular"
        fontSize={4}
      >
        <Trans i18nKey={`swap.modal.steps.finished.disclaimer`} />
      </Text>
    </Disclaimer>
  </Box>
);

export const StepFinishedFooter = ({
  result,
  swap,
  onClose,
}: {
  result: { swapId: string, operation: Operation },
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  onClose: any,
}) => {
  const { operation } = result;
  const { fromAccount, fromParentAccount } = swap.exchange;
  const dispatch = useDispatch();

  const onViewOperationDetails = useCallback(() => {
    onClose();
    if (fromAccount && operation) {
      dispatch(
        openModal("MODAL_OPERATION_DETAILS", {
          operationId: operation.id,
          accountId: fromAccount.id,
          parentId: fromParentAccount && fromParentAccount.id,
        }),
      );
    }
  }, [dispatch, fromAccount, fromParentAccount, onClose, operation]);

  return (
    <Box horizontal>
      <Button onClick={onClose} secondary>
        <Trans i18nKey="common.close" />
      </Button>
      <Button
        primary
        ml={2}
        event="Swap completed - Clicked on operation details CTA"
        onClick={onViewOperationDetails}
      >
        <Trans i18nKey="swap.modal.steps.finished.seeDetails" />
      </Button>
    </Box>
  );
};

export default StepFinished;
