// @flow

import React from "react";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import { openURL } from "~/renderer/linking";
import { track } from "~/renderer/analytics/segment";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";
import IconClock from "~/renderer/icons/Clock";
import CountdownTimer from "~/renderer/components/CountdownTimer";
import { urls } from "~/config/urls";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans, useTranslation } from "react-i18next";

import styled from "styled-components";

const FooterWrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  justify-content: space-between;
  padding: 20px;
`;

export const CountdownTimerWrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade50};
  margin-right: 24px;
  padding: 2px 12px;
  align-self: center;
  min-width: 80px;
`;

const Footer = ({
  onExpireRates,
  ratesExpiration,
  canContinue,
  onStartSwap,
}: {
  onExpireRates: () => void,
  ratesExpiration?: ?Date,
  canContinue: boolean,
  onStartSwap: () => void,
}) => {
  const { t } = useTranslation();

  return (
    <FooterWrapper horizontal>
      <LabelWithExternalIcon
        color="wallet"
        ff="Inter|SemiBold"
        onClick={() => {
          openURL(urls.swap.info);
          track("More info on swap");
        }}
        label={t("swap.form.helpCTA")}
      />
      <Box horizontal>
        {ratesExpiration ? (
          <CountdownTimerWrapper horizontal>
            <Box mr={1}>
              <IconClock size={14} />
            </Box>
            <CountdownTimer
              key={`rates-${ratesExpiration.getTime()}`}
              end={ratesExpiration}
              callback={onExpireRates}
            />
          </CountdownTimerWrapper>
        ) : null}
        <Button
          id="swap-form-continue-button"
          onClick={onStartSwap}
          primary
          event="SwapFormOpenModal"
          disabled={!canContinue}
        >
          <Trans i18nKey={"swap.form.exchange"} />
        </Button>
      </Box>
    </FooterWrapper>
  );
};

export default Footer;
