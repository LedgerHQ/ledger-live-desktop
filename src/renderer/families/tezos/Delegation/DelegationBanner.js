// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { dismissBanner } from "~/renderer/actions/settings";
import { useHaveUndelegatedAccounts } from "~/renderer/actions/general";
import { dismissedBannerSelectorLoaded } from "~/renderer/reducers/settings";
import { openModal } from "~/renderer/actions/modals";
import Box, { Card } from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import CoinWallet from "~/renderer/icons/CoinWallet";
import IconCross from "~/renderer/icons/Cross";

export default function DelegationBanner() {
  const dispatch = useDispatch();
  const isDismissed = useSelector(dismissedBannerSelectorLoaded("DELEGATION_BANNER"));
  const hasUndelegated = useHaveUndelegatedAccounts();

  const closeBanner = useCallback(() => dispatch(dismissBanner("DELEGATION_BANNER")), [dispatch]);

  return hasUndelegated && !isDismissed ? (
    <Card
      bg="palette.primary.main"
      style={{ overflow: "hidden" }}
      color="palette.primary.contrastText"
    >
      <Box horizontal pr={6} pl={180} py={3} style={{ position: "relative" }}>
        <IconContainer style={{ zIndex: 10 }} onClick={closeBanner}>
          <IconCross size={16} />
        </IconContainer>
        <Box style={{ zIndex: 10 }} flex={1} justifyContent="space-between">
          <Box mb={24}>
            <Text
              ff="Inter|SemiBold"
              fontSize={6}
              color="palette.primary.contrastText"
              style={{ maxWidth: 320 }}
            >
              <Trans i18nKey="delegation.banner.text" />
            </Text>
          </Box>
          <Box horizontal>
            <Button
              primary
              inverted
              onClick={() => {
                dispatch(openModal("MODAL_DELEGATE"));
              }}
              mr={1}
            >
              <Trans i18nKey="delegation.banner.title" />
            </Button>
            <Button onClick={closeBanner} color="palette.primary.contrastText">
              <Trans i18nKey="common.dismiss" />
            </Button>
          </Box>
        </Box>
        <LogoContainer>
          <CoinWallet size={130} />
        </LogoContainer>
      </Box>
    </Card>
  ) : null;
}

export const DELEGATION_BANNER = "DELEGATION_BANNER";

const IconContainer = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  p: 4,
}))`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`;

const LogoContainer = styled(Box).attrs(() => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}))`
  position: absolute;
  top: 10px;
  left: 20px;
  ${IconContainer} {
    width: 100%;
    max-width: 110px;
  }
`;
