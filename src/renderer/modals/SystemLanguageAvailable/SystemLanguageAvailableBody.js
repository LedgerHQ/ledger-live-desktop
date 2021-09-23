// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { TFunction } from "react-i18next";
import styled from "styled-components";
import { track } from "~/renderer/analytics/segment";

import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Link from "~/renderer/components/Link";
import Button from "~/renderer/components/Button";
import Language from "~/renderer/icons/Language";

import { rgba } from "~/renderer/styles/helpers";

type Props = {
  data: {
  currentLanguage: string,
  osLanguage: string,
  },
  onClose: () => void,
  t: TFunction,
};

const Title = styled(Text).attrs(() => ({
  ff: "Inter",
  fontSize: 18,
  color: "palette.text.shade100",
  textAlign: "center",
  fontWeight: 600,
  marginBottom: 16,
}))``;

const Content = styled(Text).attrs(() => ({
  ff: "Inter",
  fontSize: 13,
  color: "palette.text.shade50",
  textAlign: "center",
  marginBottom: 13 * 1.4,
}))``;

const NoLink = styled(Link).attrs(p => ({
  fontSize: 13,
  fontWeight: 600,
  color: "palette.text.shade50",
  mr: p.theme.space[5],
  lineHeight: "39px",
}))``;

const Circle = styled.div`
  height: 72px;
  width: 72px;
  border-radius: 72px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
`;

const IconBox = styled(Box).attrs(() => ({
  margin: "auto",
  textAlign: "center",
  position: "relative",
  marginBottom: 24,
}))``;

const LanguageBox = styled(Box).attrs(() => ({
  position: "absolute",
  top: 16,
  left: 16,
  color: "palette.primary.main",
}))``;

const SystemLanguageAvailableBody = (props: Props) => {
  const { onClose, data } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const dontSwitchLanguage = () => {
    track(`Discoverability - Denied  - ${osLanguage}`, { language: osLanguage });
  };

  const switchLanguage = () => {
    track(`Discoverability - Switch - ${osLanguage}`, { language: osLanguage });
    onClose();
  };

    return (
      <ModalBody
        onClose={onClose}
        render={() => (
          <Box>
          <TrackPage
            category="Discoverability"
            name={`Prompt - ${osLanguage}`}
            language={osLanguage}
          />
            <IconBox>
              <Circle />
              <LanguageBox>
                <Language />
              </LanguageBox>
            </IconBox>
            <Title>{t("systemLanguageAvailable.title")}</Title>
            <Content>
            {t("systemLanguageAvailable.description.newSupport", {
              language: targetLanguageTranslated,
            })}
            </Content>
          <Content>{t("systemLanguageAvailable.description.advice")}</Content>
          </Box>
        )}
        renderFooter={() => (
          <Box horizontal justifyContent="flex-end">
          <NoLink onClick={dontSwitchLanguage}>{t("systemLanguageAvailable.no")}</NoLink>
          <Button onClick={switchLanguage} primary>
              {`${t("systemLanguageAvailable.switchButton")} ${targetLanguageTranslated}`}
            </Button>
          </Box>
        )}
      />
    );
};

export default SystemLanguageAvailableBody;
