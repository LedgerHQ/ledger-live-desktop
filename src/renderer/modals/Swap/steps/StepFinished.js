// @flow
import React, { useEffect, useCallback } from "react";
import type { Operation } from "@ledgerhq/live-common/lib/types/operation";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import Box from "~/renderer/components/Box";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { colors } from "~/renderer/styles/theme";
import Alert from "~/renderer/components/Alert";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { OperationDetails } from "~/renderer/drawers/OperationDetails";
import { setDrawer } from "~/renderer/drawers/Provider";
import { GradientHover } from "~/renderer/drawers/OperationDetails/styledComponents";
import FakeLink from "~/renderer/components/FakeLink";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import IconCheck from "~/renderer/icons/Check";
import IconClock from "~/renderer/icons/Clock";

const IconWrapper = styled(Box)`
  background: ${colors.lightGreen};
  color: ${colors.positiveGreen};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  position: relative;
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

const WrapperClock: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  color: "palette.text.shade60",
}))`
  border-radius: 50%;
  position: absolute;
  bottom: -2px;
  right: -2px;
  padding: 2px;
`;

const StepFinished = ({
  swapId,
  provider,
  targetCurrency,
  setLocked,
}: {
  swapId: string,
  provider: string,
  targetCurrency: string,
  setLocked: boolean => void,
}) => {
  useEffect(() => {
    setLocked(false);
  }, [setLocked]);

  const openProviderSupport = useCallback(() => {
    openURL(urls.swap.providers[provider]?.support);
  }, [provider]);

  const SwapPill = ({ swapId }: { swapId: string }) => (
    <SwapIdWrapper>
      <Pill color="palette.text.shade100" ff="Inter|SemiBold" fontSize={14}>
        {swapId}
      </Pill>
      <GradientHover>
        <CopyWithFeedback text={swapId} />
      </GradientHover>
    </SwapIdWrapper>
  );

  return (
    <Box alignItems="center">
      <IconWrapper>
        <IconCheck size={18} />
        <WrapperClock>
          <IconClock size={14} />
        </WrapperClock>
      </IconWrapper>
      <Text mt={16} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.modal.steps.finished.subtitle`} />
      </Text>
      <Text p={20} textAlign="center" color="palette.text.shade50" ff="Inter|Regular" fontSize={4}>
        <Trans i18nKey={`swap.modal.steps.finished.description`} values={{ targetCurrency }} />
      </Text>
      <Alert type="help" mt={3} right={<SwapPill swapId={swapId} />}>
        <Trans i18nKey={`swap.modal.steps.finished.disclaimer`} values={{ provider }}>
          <FakeLink onClick={openProviderSupport}>
            <CapitalizedText style={{ marginRight: 4 }}>{provider}</CapitalizedText>
          </FakeLink>
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
      <Button onClick={onClose} secondary id="swap-modal-finished-close-button">
        <Trans i18nKey="common.close" />
      </Button>
      <Button
        id="swap-modal-finished-details-button"
        primary
        mr={2}
        event="Swap completed - Clicked on operation details CTA"
        onClick={onViewOperationDetails}
      >
        <Trans i18nKey="swap.modal.steps.finished.seeDetails" />
      </Button>
    </Box>
  );
};

export default StepFinished;
