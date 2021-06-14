// @flow
import React, { useEffect, useCallback } from "react";
import type { Operation } from "@ledgerhq/live-common/lib/types/operation";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import Box from "~/renderer/components/Box";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import IconSwap from "~/renderer/icons/Swap";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import Alert from "~/renderer/components/Alert";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { OperationDetails } from "~/renderer/drawers/OperationDetails";
import { setDrawer } from "~/renderer/drawers/Provider";
import { GradientHover } from "~/renderer/drawers/OperationDetails/styledComponents";

const IconWrapper = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

const CapitalizedText = styled.span`
  text-transform: capitalize;
`;

const Pill = styled(Text)`
  user-select: text;
  border-radius: 4px;
  background: ${p => p.theme.colors.palette.text.shade10};
  padding: 0 8px;
`;

const SwapIdWrapper: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter",
  color: p.color || "palette.text.shade80",
  fontSize: 4,
  relative: true,
}))`

  ${GradientHover} {
    display: none;
  }

  &:hover ${GradientHover} {
    display: flex;
    & > * {
      cursor: pointer;
    }
  }

  &:hover ${Pill} {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
}
`;

const StepFinished = ({
  swapId,
  provider,
  setLocked,
}: {
  swapId: string,
  provider: string,
  setLocked: boolean => void,
}) => {
  useEffect(() => {
    setLocked(false);
  }, [setLocked]);

  return (
    <Box alignItems="center">
      <IconWrapper>
        <IconSwap size={18} />
      </IconWrapper>
      <Text mt={16} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.modal.steps.finished.subtitle`} />
      </Text>
      <Box mt={16} horizontal alignItems="center">
        <Text color="palette.text.shade50" ff="Inter|Regular" fontSize={14}>
          <Trans i18nKey={`swap.modal.steps.finished.swap`} />
        </Text>
        <SwapIdWrapper>
          <Pill ml={2} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={14}>
            {swapId}
          </Pill>
          <GradientHover>
            <CopyWithFeedback text={swapId} />
          </GradientHover>
        </SwapIdWrapper>
      </Box>
      <Text p={20} textAlign="center" color="palette.text.shade50" ff="Inter|Regular" fontSize={4}>
        <Trans i18nKey={`swap.modal.steps.finished.description`} />
      </Text>
      <Alert type="primary" mt={3}>
        <Trans i18nKey={`swap.modal.steps.finished.disclaimer`} values={{ provider }}>
          <CapitalizedText>{provider}</CapitalizedText>
        </Trans>
      </Alert>
    </Box>
  );
};

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

  const onViewOperationDetails = useCallback(() => {
    const concernedOperation = operation
      ? operation.subOperations && operation.subOperations.length > 0
        ? operation.subOperations[0]
        : operation
      : null;

    onClose();
    if (fromAccount && concernedOperation) {
      setDrawer(OperationDetails, {
        operationId: concernedOperation.id,
        accountId: fromAccount.id,
        parentId: fromParentAccount && fromParentAccount.id,
      });
    }
  }, [fromAccount, fromParentAccount, onClose, operation]);

  return (
    <Box horizontal>
      <Button
        id="swap-modal-finished-details-button"
        secondary
        mr={2}
        event="Swap completed - Clicked on operation details CTA"
        onClick={onViewOperationDetails}
      >
        <Trans i18nKey="swap.modal.steps.finished.seeDetails" />
      </Button>
      <Button onClick={onClose} primary id="swap-modal-finished-close-button">
        <Trans i18nKey="common.close" />
      </Button>
    </Box>
  );
};

export default StepFinished;
