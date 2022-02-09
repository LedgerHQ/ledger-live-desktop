// @flow

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import type { PlatformAppDrawers as AppDrawerPayload } from "~/renderer/reducers/UI.js";

import { SideDrawer } from "~/renderer/components/SideDrawer";
import CheckBox from "~/renderer/components/CheckBox";
import Button from "~/renderer/components/Button";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";

import { dismissBanner } from "~/renderer/actions/settings";
import { closePlatformAppDrawer } from "~/renderer/actions/UI";
import { platformAppDrawerStateSelector } from "~/renderer/reducers/UI";

import Text from "../Text";
import AppDetails from "../Platform/AppDetails";
import ExternalLink from "../ExternalLink/index";
import LiveAppDisclaimer from "./LiveAppDisclaimer";

const Divider = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

export const LiveAppDrawer = () => {
  const [dismissDisclaimerChecked, setDismissDisclaimerChecked] = useState<boolean>(false);
  const { isOpen, payload }: { isOpen: boolean, payload: AppDrawerPayload } = useSelector(
    platformAppDrawerStateSelector,
  );
  const { manifest, type, title, disclaimerId, next } = payload ?? {};
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onContinue = useCallback(() => {
    if (dismissDisclaimerChecked && disclaimerId) {
      dispatch(dismissBanner(disclaimerId));
    }
    dispatch(closePlatformAppDrawer());
    next();
  }, [dismissDisclaimerChecked, dispatch, disclaimerId, next]);

  const drawerContent = () => {
    if (!manifest) {
      return null;
    }

    switch (type) {
      case "DAPP_INFO":
        return (
          <Box pt={7} px={6}>
            <AppDetails manifest={manifest} />
            <Divider my={6} />
            <Text ff="Inter|SemiBold">{t(`platform.app.informations.website`)}</Text>
            <Text ff="Inter" color="#8a80db">
              <ExternalLink
                label={manifest?.homepageUrl}
                isInternal={false}
                onClick={() => openURL(manifest?.homepageUrl)}
              />
            </Text>
          </Box>
        );

      case "DAPP_DISCLAIMER":
        return (
          <>
            <Box px={6} flex={1} justifyContent="center">
              <Box>
                <LiveAppDisclaimer manifest={manifest} />
              </Box>
            </Box>

            <Box pb={24}>
              <Divider my={24} />
              <Box px={6} horizontal alignItems="center" justifyContent="space-between">
                <Box
                  horizontal
                  alignItems="flex-start"
                  onClick={() => setDismissDisclaimerChecked(!dismissDisclaimerChecked)}
                  style={{ flex: 1, cursor: "pointer" }}
                >
                  <CheckBox isChecked={dismissDisclaimerChecked} id="dismiss-disclaimer" />
                  <Text
                    ff="Inter|SemiBold"
                    fontSize={4}
                    style={{ marginLeft: 8, overflowWrap: "break-word", flex: 1 }}
                  >
                    {t("platform.disclaimer.checkbox")}
                  </Text>
                </Box>

                <Button primary onClick={onContinue}>
                  {t("platform.disclaimer.CTA")}
                </Button>
              </Box>
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SideDrawer
      title={t(title)}
      isOpen={isOpen}
      onRequestClose={() => {
        dispatch(closePlatformAppDrawer());
      }}
      direction="left"
    >
      <Box flex="1" justifyContent="space-between">
        {drawerContent()}
      </Box>
    </SideDrawer>
  );
};
