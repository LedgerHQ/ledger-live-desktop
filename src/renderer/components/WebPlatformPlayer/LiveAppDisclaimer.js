// @flow

import React from "react";
import styled, { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";

import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import InfoIcon from "~/renderer/icons/InfoCircle";
import { rgba } from "~/renderer/styles/helpers";
import Logo from "~/renderer/icons/Logo";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";

type Props = {
  manifest: AppManifest,
};

const Head: ThemedComponent<{}> = styled(Box).attrs(p => ({
  horizontal: true,
  alignItems: "center",
  justifyContent: "center",
  mb: 24,
}))`
  > * {
    margin: 0 4px;
  }
`;

const Dashes: ThemedComponent<{}> = styled.div`
  width: 40px;
  opacity: 0.5;
  height: 3px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='1' y1='1.5' x2='39' y2='1.5' stroke='%23${p =>
    p.theme.colors.palette.primary.main.slice(
      1,
    )}' stroke-opacity='0.5' stroke-width='2' stroke-linecap='round' stroke-dasharray='2 6'/%3E%3C/svg%3E%0A");
`;

const Title: ThemedComponent<{}> = styled(Text).attrs(p => ({
  mb: 12,
  fontSize: 22,
  textAlign: "center",
  ff: "Inter|SemiBold",
}))``;

const Description: ThemedComponent<{}> = styled(Text).attrs(p => ({
  color: p.theme.colors.palette.text.shade60,
  ff: "Inter|Regular",
  mb: 12,
  textAlign: "center",
  fontSize: 14,
}))``;

const BlueInfoContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  flex: 1,
  p: 12,
  horizontal: true,
  alignItems: "center",
  mt: 28,
}))`
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
`;

const InfoIconContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  mr: "6px",
}))``;

const InfoText: ThemedComponent<{}> = styled(Text).attrs(p => ({
  ml: "6px",
  ff: "Inter|Medium",
  fontSize: 12,
  lineHeight: 18,
  color: p.theme.colors.palette.primary.main,
}))`
  flex: 1;
  line-height: 18px;
  white-space: pre-wrap;
`;

export const LiveAppDisclaimer = ({ manifest }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <LedgerLiveLogo width={48} height={48} icon={<Logo size={31} />} />
        <Dashes />
        <LiveAppIcon size={48} name={manifest.name} icon={manifest.icon || ""} />
      </Head>

      <Title>{t("platform.disclaimer.title")}</Title>

      <Description>{t("platform.disclaimer.description")}</Description>

      <BlueInfoContainer>
        <InfoIconContainer>
          <InfoIcon color={colors.palette.primary.main} size={20} />
        </InfoIconContainer>
        <InfoText>{t("platform.disclaimer.legalAdvice")}</InfoText>
      </BlueInfoContainer>
    </>
  );
};

export default LiveAppDisclaimer;
