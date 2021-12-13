// @flow
import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { colors } from "~/renderer/styles/theme";
import Alert from "~/renderer/components/Alert";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
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
  padding: 3px 6px;
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

const SwapCompleted = ({
  swapId,
  provider,
  targetCurrency,
}: {
  swapId: string,
  provider: string,
  targetCurrency: string,
}) => {
  const openProviderSupport = useCallback(() => {
    openURL(urls.swap.providers[provider]?.support);
  }, [provider]);

  const SwapPill = ({ swapId }: { swapId: string }) => (
    <SwapIdWrapper>
      <Pill color="palette.text.shade100" ff="Inter|SemiBold" fontSize={4} data-test-id="swap-id">
        #{swapId}
      </Pill>
      <GradientHover>
        <CopyWithFeedback text={swapId} />
      </GradientHover>
    </SwapIdWrapper>
  );

  return (
    <Box alignItems="center">
      <IconWrapper>
        <IconCheck size={20} />
        <WrapperClock>
          <IconClock size={16} />
        </WrapperClock>
      </IconWrapper>
      <Text mt={4} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap2.exchangeDrawer.completed.title`} />
      </Text>
      <Text mt={13} textAlign="center" color="palette.text.shade50" ff="Inter|Regular" fontSize={4}>
        <Trans i18nKey={`swap2.exchangeDrawer.completed.description`} values={{ targetCurrency }} />
      </Text>
      <Alert type="help" mt={6} right={<SwapPill swapId={swapId} />}>
        <Trans i18nKey={`swap2.exchangeDrawer.completed.disclaimer`} values={{ provider }}>
          <FakeLink onClick={openProviderSupport}>
            <CapitalizedText style={{ marginRight: 4 }}>{provider}</CapitalizedText>
          </FakeLink>
        </Trans>
      </Alert>
    </Box>
  );
};

export default SwapCompleted;
