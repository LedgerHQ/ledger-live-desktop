// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { dismissBanner } from "~/renderer/actions/settings";
import { dismissedBannerSelectorLoaded } from "~/renderer/reducers/settings";
import Box, { Card } from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import IconCross from "~/renderer/icons/Cross";
import Exchange from "~/renderer/icons/Exchange";
import { rgba } from "~/renderer/styles/helpers";

export const EXCHANGE_BANNER = "EXCHANGE_BANNER";

const IconContainer = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  p: 2,
}))`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`;

const LogoContainer = styled(Box).attrs(() => ({
  justifyContent: "center",
  alignItems: "center",
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${p =>
    p.theme.colors.palette.type === "dark"
      ? p.theme.colors.palette.primary.contrastText
      : rgba(p.theme.colors.palette.primary.main, 0.2)};
  color: ${p => p.theme.colors.palette.primary.main};
  margin: 0px 24px;
`;

const DelegationBanner = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isDismissed = useSelector(dismissedBannerSelectorLoaded("EXCHANGE_BANNER"));

  const closeBanner = useCallback(() => dispatch(dismissBanner("EXCHANGE_BANNER")), [dispatch]);

  return !isDismissed ? (
    <Card
      bg="palette.background.paper"
      style={{ overflow: "hidden", position: "relative" }}
      color="palette.primary.contrastText"
    >
      <Box horizontal color="palette.text.shade80" pr={6} py={3}>
        <IconContainer style={{ zIndex: 10 }} onClick={closeBanner}>
          <IconCross size={16} />
        </IconContainer>
        <Box horizontal style={{ zIndex: 10 }} flex={1} alignItems="center">
          <LogoContainer>
            <Exchange size={16} />
          </LogoContainer>
          <Box vertical style={{ maxWidth: 400 }}>
            <Text
              fontSize={4}
              ff="Inter|SemiBold"
              color="palette.text.shade100"
              style={{ paddingBottom: 4 }}
            >
              <Trans i18nKey="exchange.banner.title" />
            </Text>
            <Text fontSize={3} ff="Inter|Medium">
              <Trans i18nKey="exchange.banner.description" />
            </Text>
          </Box>
          <Box ml={"auto"}>
            <Button
              primary
              onClick={() => {
                history.push("/exchange");
              }}
            >
              <Trans i18nKey="exchange.banner.CTA" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  ) : null;
};

export default DelegationBanner;
