// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { TFunction } from "react-i18next";
import styled from "styled-components";
import moment from "moment";

import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import LanguageIcon from "~/renderer/icons/Language";

import { setLanguage } from "~/renderer/actions/settings";
import { answerLanguageAvailable } from "~/renderer/components/IsSystemLanguageAvailable";

type Props = {
  data: {
    currentLanguage: string,
    osLanguage: string,
  },
  onClose: () => void,
  t?: TFunction,
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
  marginBottom: 18,
}))``;

const Circle = styled.div`
  height: 72px;
  width: 72px;
  border-radius: 72px;
  background-color: ${p => p.theme.colors.pillActiveBackground};
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
  const { osLanguage } = data;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const targetLanguageTranslated = t(`language.switcher.${osLanguage}`);

  const dontSwitchLanguage = () => {
    answerLanguageAvailable();
    onClose();
  };

  const switchLanguage = () => {
    dispatch(setLanguage(osLanguage));
    moment.locale(osLanguage);
    i18n.changeLanguage(osLanguage);
    answerLanguageAvailable();
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
              <LanguageIcon />
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
          <Button
            mx={15}
            secondary
            event={`Discoverability - Denied - ${osLanguage}`}
            eventProperties={{ language: osLanguage }}
            onClick={dontSwitchLanguage}
          >
            {t("systemLanguageAvailable.no")}
          </Button>
          <Button
            primary
            event={`Discoverability - Switch - ${osLanguage}`}
            eventProperties={{ language: osLanguage }}
            onClick={switchLanguage}
          >
            {t("systemLanguageAvailable.switchButton", {
              language: targetLanguageTranslated,
            })}
          </Button>
        </Box>
      )}
    />
  );
};

export default SystemLanguageAvailableBody;
